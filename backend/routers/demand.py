from fastapi import APIRouter, HTTPException

from ML.xgboost import predict_demand

router = APIRouter()

@router.get("/")
def get_demand_forecast():
    try:
        df = predict_demand()
        return {"status": "success", "data": df.to_dict(orient="records")}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
