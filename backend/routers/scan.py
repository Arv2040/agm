from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import HTMLResponse
from db.db_setup import equipment_collection  

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
def scan_item(item_id: str = Query(...), vehicle_type: str = Query(...)):
    # Find equipment in DB
    equipment = equipment_collection.find_one({"_id": item_id, "type": vehicle_type})
    if not equipment:
        raise HTTPException(status_code=404, detail=f"{vehicle_type} with ID {item_id} not found")

    # Logic for status toggle
    if equipment["status"] == "available":
        equipment_collection.update_one({"_id": item_id}, {"$set": {"status": "active"}})
        message = f"<h2>✅ {vehicle_type} ({item_id}) has been RENTED</h2>"
    elif equipment["status"] == "rented":
        equipment_collection.update_one({"_id": item_id}, {"$set": {"status": "available"}})
        message = f"<h2>📦 {vehicle_type} ({item_id}) has been RETURNED</h2>"
    else:
        message = f"<h2>ℹ️ {vehicle_type} ({item_id}) is ALREADY RETURNED</h2>"

    return f"""
    <html>
        <head>
            <title>Rental Status</title>
            <style>
                body {{ font-family: Arial, sans-serif; text-align: center; margin-top: 20%; }}
                h2 {{ color: #2E86C1; }}
            </style>
        </head>
        <body>
            {message}
        </body>
    </html>
    """
