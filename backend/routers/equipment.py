from fastapi import APIRouter, HTTPException
from db.db_setup import equipment_collection
from db.models import Equipment
from utils import serialize_doc

router = APIRouter()

@router.post("/")
def add_equipment(item: Equipment):
    if equipment_collection.find_one({"_id": item.id}):
        raise HTTPException(status_code=400, detail=f"Equipment with ID {item.id} already exists.")
    
    equipment_doc = {"_id": item.id, "type": item.type, "status": item.status}
    equipment_collection.insert_one(equipment_doc)
    return {"message": "Equipment added successfully!", "equipment": item.dict()}

@router.get("/")
def get_all_equipment():
    items = [serialize_doc(doc) for doc in equipment_collection.find()]
    return {"equipment": items}