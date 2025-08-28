from fastapi import APIRouter
from db.db_setup import demand_data_collection

router = APIRouter()

@router.get("/")
def get_demand_data():
	data = list(demand_data_collection.find({}, {"_id": 0}))
	return {"demand_data": data}
