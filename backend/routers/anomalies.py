from fastapi import APIRouter
from datetime import datetime, timedelta
from ..db.db_setup import usage_logs_collection, rentals_collection
from ..db.models import UsageLog

router = APIRouter()

# Note: I'm adding the /usage endpoint here as it's related to anomalies.
@router.post("/usage")
def log_usage(usage_data: UsageLog):
    log_entry = usage_data.dict()
    log_entry["timestamp"] = datetime.utcnow()
    usage_logs_collection.insert_one(log_entry)
    return {"message": "Usage log received successfully."}

@router.get("/idle")
def get_idle_anomalies(idle_threshold: float = 0.6):
    pipeline = [
        {"$group": {"_id": "$equipment_id", "total_engine_hours": {"$max": "$engine_hours"}, "total_idle_hours": {"$max": "$idle_hours"}}},
        {"$project": {"equipment_id": "$_id", "_id": 0, "idle_ratio": {"$cond": [{"$eq": ["$total_engine_hours", 0]}, 0, {"$divide": ["$total_idle_hours", "$total_engine_hours"]}]}}},
        {"$match": {"idle_ratio": {"$gt": idle_threshold}}}
    ]
    anomalies = [doc for doc in usage_logs_collection.aggregate(pipeline)]
    if not anomalies:
        return {"message": "No idle anomalies found."}
    return {"idle_anomalies": anomalies}

@router.get("/zero-usage")
def get_zero_usage_anomalies(inactive_threshold_hours: int = 24):
    anomalies = []
    active_rentals = rentals_collection.find({"is_active": True})
    threshold_time = datetime.utcnow() - timedelta(hours=inactive_threshold_hours)
    
    for rental in active_rentals:
        equipment_id = rental["equipment_id"]
        latest_log = usage_logs_collection.find_one({"equipment_id": equipment_id}, sort=[("timestamp", -1)])
        
        if not latest_log or latest_log["timestamp"] < threshold_time:
            anomaly_info = {
                "equipment_id": equipment_id,
                "site_id": rental["site_id"],
                "last_active": "Never" if not latest_log else latest_log["timestamp"].strftime('%Y-%m-%d %H:%M'),
                "message": f"Asset has been inactive for more than {inactive_threshold_hours} hours."
            }
            anomalies.append(anomaly_info)
            
    if not anomalies:
        return {"message": "No zero-usage anomalies found."}
    return {"zero_usage_anomalies": anomalies}