from fastapi import FastAPI
from fastapi.responses import JSONResponse
import random
from datetime import datetime

app = FastAPI()

VEHICLE_ID = "EX001"
VEHICLE_INFO = {"type": "Excavator", "model": "CAT 320D"}


def generate_telemetry():
    return {
        "vehicle_id": VEHICLE_ID,
        "timestamp": datetime.now().isoformat(),
        "engine_hours": round(random.uniform(1, 8), 2),
        "idle_hours": round(random.uniform(0, 2), 2),
        "fuel_consumed": round(random.uniform(5, 50), 2),
        "latitude": round(random.uniform(-90, 90), 6),
        "longitude": round(random.uniform(-180, 180), 6),
        "load_factor_pct": round(random.uniform(50, 100), 2)
    }


@app.get("/scan_telemetry_qr/")
def scan_telemetry_qr():
    telemetry = generate_telemetry()
    
    return JSONResponse({
        "message": f"Vehicle {VEHICLE_ID} scanned successfully for telemetry!",
        "vehicle_info": VEHICLE_INFO,
        "telemetry": telemetry
    })

# this real time data can be used for anomaly detection purposes.