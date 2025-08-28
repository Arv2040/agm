from fastapi import APIRouter, HTTPException
from ..db.db_setup import operators_collection
from ..db.models import Operator

router = APIRouter()

@router.post("/")
def add_operator(op: Operator):
    operator_doc = {"_id": op.id, "name": op.name, "email": op.email}
    if operators_collection.find_one({"_id": op.id}):
        raise HTTPException(status_code=400, detail=f"Operator with ID {op.id} already exists.")
    
    operators_collection.insert_one(operator_doc)
    return {"message": "Operator added successfully!", "operator": op.dict()}