from fastapi import FastAPI, HTTPException
from datetime import datetime, timedelta
from db.models import UsageLog
from db.db_setup import usage_logs_collection
# Add Operator model and operators_collection to your imports
from db.models import Operator
from db.db_setup import operators_collection

# Import all collections from your database setup
from db.db_setup import equipment_collection, rentals_collection, usage_logs_collection

# Import all Pydantic models
from db.models import Equipment, RentalCheckout, RentalCheckin, UsageLog

app = FastAPI()

# --- Helper Functions ---

def serialize_doc(doc):
    """Converts a MongoDB doc to a JSON-serializable format."""
    if "_id" in doc and not isinstance(doc["_id"], str):
        doc["_id"] = str(doc["_id"])
    return doc

# --- Core API Endpoints ---

@app.get("/")
def home():
    return {"message": "Welcome to the Smart Rental Tracking API 🚀"}

# --- Equipment Endpoints ---

@app.post("/equipment/")
def add_equipment(item: Equipment):
    """Adds a new piece of equipment to the database."""
    if equipment_collection.find_one({"_id": item.id}):
        raise HTTPException(status_code=400, detail=f"Equipment with ID {item.id} already exists.")
    
    equipment_doc = {"_id": item.id, "type": item.type, "status": item.status}
    equipment_collection.insert_one(equipment_doc)
    return {"message": "Equipment added successfully!", "equipment": item.dict()}

@app.get("/equipment/")
def get_all_equipment():
    """Retrieves a list of all equipment and their status."""
    items = [serialize_doc(doc) for doc in equipment_collection.find()]
    return {"equipment": items}

# --- Rental Logic Endpoints ---

@app.post("/rentals/checkout")
def checkout_equipment(checkout_data: RentalCheckout):
    """Checks out a piece of equipment, changing its status to 'Rented'."""
    equipment = equipment_collection.find_one({"_id": checkout_data.equipment_id})
    
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found.")
    if equipment.get("status") != "Available":
        raise HTTPException(status_code=400, detail="Equipment is not available for rental.")

    equipment_collection.update_one({"_id": checkout_data.equipment_id}, {"$set": {"status": "Rented"}})

    new_rental = {
        "equipment_id": checkout_data.equipment_id,
        "site_id": checkout_data.site_id,
        "operator_id": checkout_data.operator_id,
        "check_out_date": datetime.utcnow(),
        "expected_check_in_date": datetime.utcnow() + timedelta(days=14),
        "actual_check_in_date": None,
        "is_active": True
    }
    rentals_collection.insert_one(new_rental)
    
    return {"message": f"Equipment {checkout_data.equipment_id} checked out successfully!"}

@app.post("/rentals/checkin")
def checkin_equipment(checkin_data: RentalCheckin):
    """Checks in a piece of equipment, changing its status to 'Available'."""
    active_rental = rentals_collection.find_one({"equipment_id": checkin_data.equipment_id, "is_active": True})

    if not active_rental:
        raise HTTPException(status_code=404, detail="No active rental found for this equipment.")

    rentals_collection.update_one({"_id": active_rental["_id"]}, {"$set": {"is_active": False, "actual_check_in_date": datetime.utcnow()}})
    equipment_collection.update_one({"_id": checkin_data.equipment_id}, {"$set": {"status": "Available"}})

    return {"message": f"Equipment {checkin_data.equipment_id} checked in successfully!"}

# --- Usage Data Endpoint ---

@app.post("/usage")
def log__usage(usage_data: UsageLog):
    """Receives and stores real-time usage data from equipment."""
    log_entry = {
        "equipment_id": usage_data.equipment_id,
        "engine_hours": usage_data.engine_hours,
        "idle_hours": usage_data.idle_hours,
        "fuel_level": usage_data.fuel_level,
        "timestamp": datetime.utcnow()
    }
    usage_logs_collection.insert_one(log_entry)
    return {"message": "Usage log received successfully."}
@app.get("/rentals/overdue")
def get_overdue_rentals():
    """Finds all active rentals that are past their expected check-in date."""
    now = datetime.utcnow()
    
    # Query for rentals that are still active AND whose return date is in the past
    query = {
        "is_active": True,
        "expected_check_in_date": {"$lt": now}
    }
    
    overdue_items = [serialize_doc(doc) for doc in rentals_collection.find(query)]
    
    if not overdue_items:
        return {"message": "No overdue rentals found."}
        
    return {"overdue_rentals": overdue_items}

    # in index.py


@app.post("/operators/")
def add_operator(op: Operator):
    """Adds a new operator to the database."""
    operator_doc = {"_id": op.id, "name": op.name, "email": op.email}
    if operators_collection.find_one({"_id": op.id}):
        raise HTTPException(status_code=400, detail=f"Operator with ID {op.id} already exists.")
    
    operators_collection.insert_one(operator_doc)
    return {"message": "Operator added successfully!", "operator": op.dict()}