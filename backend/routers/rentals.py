from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from ..db.db_setup import rentals_collection, equipment_collection, operators_collection
from ..db.models import RentalCheckout, RentalCheckin
from ..utils import serialize_doc

router = APIRouter()

@router.post("/checkout")
def checkout_equipment(checkout_data: RentalCheckout):
    equipment = equipment_collection.find_one({"_id": checkout_data.equipment_id})
    if not equipment or equipment.get("status") != "Available":
        raise HTTPException(status_code=400, detail="Equipment is not available for rental.")

    equipment_collection.update_one({"_id": checkout_data.equipment_id}, {"$set": {"status": "Rented"}})
    new_rental = checkout_data.dict()
    new_rental.update({
        "check_out_date": datetime.utcnow(),
        "expected_check_in_date": datetime.utcnow() + timedelta(days=14),
        "actual_check_in_date": None,
        "is_active": True
    })
    rentals_collection.insert_one(new_rental)
    return {"message": f"Equipment {checkout_data.equipment_id} checked out successfully!"}

@router.post("/checkin")
def checkin_equipment(checkin_data: RentalCheckin):
    active_rental = rentals_collection.find_one({"equipment_id": checkin_data.equipment_id, "is_active": True})
    if not active_rental:
        raise HTTPException(status_code=404, detail="No active rental found for this equipment.")

    rentals_collection.update_one({"_id": active_rental["_id"]}, {"$set": {"is_active": False, "actual_check_in_date": datetime.utcnow()}})
    equipment_collection.update_one({"_id": checkin_data.equipment_id}, {"$set": {"status": "Available"}})
    return {"message": f"Equipment {checkin_data.equipment_id} checked in successfully!"}

@router.get("/overdue")
def get_overdue_rentals():
    now = datetime.utcnow()
    query = {"is_active": True, "expected_check_in_date": {"$lt": now}}
    overdue_items = [serialize_doc(doc) for doc in rentals_collection.find(query)]
    
    if not overdue_items:
        return {"message": "No overdue rentals found."}
    
    print("\n--- CHECKING FOR OVERDUE NOTIFICATIONS ---")
    for item in overdue_items:
        operator_id = item.get("operator_id")
        if operator_id:
            operator = operators_collection.find_one({"_id": operator_id})
            if operator:
                print(f"--> 📧 NOTIFICATION SENT to {operator['name']} ({operator['email']}): Vehicle {item['equipment_id']} is overdue!")
    print("----------------------------------------\n")
    
    return {"overdue_rentals": overdue_items}