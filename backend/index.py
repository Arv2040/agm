from fastapi import FastAPI, HTTPException
from db.db_setup import equipment_collection, rentals_collection
from db.models import Equipment, RentalCheckout # Import your new models
from datetime import datetime, timedelta
from bson import ObjectId

app = FastAPI()

# Helper function to convert MongoDB ObjectId to string
def serialize_doc(doc):
   if "_id" in doc:
       doc["_id"] = str(doc["_id"])
   return doc

@app.get("/")
def home():
   return {"message": "Welcome to the Smart Rental Tracking API 🚀"}

# --- Equipment Endpoints ---

@app.post("/equipment/")
def add_equipment(item: Equipment):
    # Check if equipment with this ID already exists
    if equipment_collection.find_one({"_id": item.id}):
        raise HTTPException(status_code=400, detail=f"Equipment with ID {item.id} already exists.")
    
    # In MongoDB, the primary key is often _id
    equipment_doc = {"_id": item.id, "type": item.type, "status": item.status}
    equipment_collection.insert_one(equipment_doc)
    return {"message": "Equipment added successfully!", "equipment": item.dict()}

@app.get("/equipment/")
def get_all_equipment():
    items = [doc for doc in equipment_collection.find()]
    return {"equipment": items}

# --- Rental Logic Endpoints ---

@app.post("/rentals/checkout")
def checkout_equipment(checkout_data: RentalCheckout):
    # 1. Find the equipment and check if it's available
    equipment = equipment_collection.find_one({"_id": checkout_data.equipment_id})
    
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found.")
    if equipment.get("status") != "Available":
        raise HTTPException(status_code=400, detail="Equipment is not available for rental.")

    # 2. Update the equipment's status to "Rented"
    equipment_collection.update_one(
        {"_id": checkout_data.equipment_id},
        {"$set": {"status": "Rented"}}
    )

    # 3. Create a new rental record
    new_rental = {
        "equipment_id": checkout_data.equipment_id,
        "site_id": checkout_data.site_id,
        "operator_id": checkout_data.operator_id,
        "check_out_date": datetime.utcnow(),
        "expected_check_in_date": datetime.utcnow() + timedelta(days=14), # Example: 14-day rental
        "actual_check_in_date": None,
        "is_active": True
    }
    rentals_collection.insert_one(new_rental)
    
    return {"message": f"Equipment {checkout_data.equipment_id} checked out successfully!"}