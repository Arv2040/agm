from fastapi import APIRouter, HTTPException
from ..db.db_setup import equipment_collection
from ..db.models import Equipment
from ..utils import serialize_doc
from ..ML.xgboost import predict_demand_mongo

router = APIRouter()

@router.get("/")
def get_demand_forecast():
    try:
        uri = "mongodb+srv://username:password@cluster0.mongodb.net" 
        db_name = "CaterpillarDB" 
        collection_name = "VehicleData"  

        result = predict_demand_mongo(uri, db_name, collection_name)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
