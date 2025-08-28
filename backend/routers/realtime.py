from fastapi import FastAPI, Query
from datetime import datetime
from fastapi import APIRouter



router = APIRouter()


VEHICLES = ["VEH1", "VEH2", "VEH3"]

SIMULATION_DATA = {
    "VEH1": [
        {"engine_hours": 4, "idle_hours": 1, "temperature": 72},
        {"engine_hours": 4.1, "idle_hours": 1.1, "temperature": 72},
        {"engine_hours": 4.2, "idle_hours": 1.0, "temperature": 73},
        {"engine_hours": 4.0, "idle_hours": 1.2, "temperature": 72},
        {"engine_hours": 4.3, "idle_hours": 1.1, "temperature": 73},
        {"engine_hours": 4.5, "idle_hours": 1.0, "temperature": 72},
        {"engine_hours": 4.2, "idle_hours": 1.2, "temperature": 73},
        {"engine_hours": 4.4, "idle_hours": 1.1, "temperature": 72},
        {"engine_hours": 4.3, "idle_hours": 1.0, "temperature": 73},
        {"engine_hours": 4.5, "idle_hours": 1.1, "temperature": 72},
        {"engine_hours": 4.2, "idle_hours": 1.2, "temperature": 72},
        {"engine_hours": 4.3, "idle_hours": 1.0, "temperature": 73},
        {"engine_hours": 4.4, "idle_hours": 1.1, "temperature": 72},
        {"engine_hours": 4.5, "idle_hours": 1.0, "temperature": 72},
        {"engine_hours": 4.2, "idle_hours": 1.1, "temperature": 73},
        {"engine_hours": 4.3, "idle_hours": 1.2, "temperature": 72},
        {"engine_hours": 4.4, "idle_hours": 1.0, "temperature": 73},
        {"engine_hours": 4.5, "idle_hours": 1.1, "temperature": 72},
        {"engine_hours": 4.6, "idle_hours": 1.2, "temperature": 73},
        {"engine_hours": 8, "idle_hours": 3, "temperature": 90},  # last triggers error
    ],
    "VEH2": [
        {"engine_hours": 3, "idle_hours": 0.8, "temperature": 70},
        {"engine_hours": 3.1, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.2, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.0, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.3, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.1, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.2, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.3, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.4, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.2, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.3, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.4, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.1, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.2, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.3, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.4, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.5, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 3.6, "idle_hours": 0.9, "temperature": 70},
        {"engine_hours": 3.5, "idle_hours": 0.8, "temperature": 71},
        {"engine_hours": 7.5, "idle_hours": 2.5, "temperature": 88},  # last triggers error
    ],
    "VEH3": [
        {"engine_hours": 2, "idle_hours": 0.5, "temperature": 68},
        {"engine_hours": 2.1, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.2, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.0, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.1, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.2, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.3, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.1, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.2, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.3, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.4, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.1, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.2, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.3, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.4, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.5, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.6, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 2.5, "idle_hours": 0.6, "temperature": 68},
        {"engine_hours": 2.7, "idle_hours": 0.5, "temperature": 69},
        {"engine_hours": 6, "idle_hours": 2, "temperature": 85},  # last triggers error
    ]
}

VEHICLE_INDEX = {vid: 0 for vid in VEHICLES}

THRESHOLDS = {"engine_hours": 7, "idle_hours": 2, "temperature": 85}

def check_thresholds(data):
    errors = []
    if data["engine_hours"] > THRESHOLDS["engine_hours"]:
        errors.append("Engine hours exceeded threshold")
    if data["idle_hours"] > THRESHOLDS["idle_hours"]:
        errors.append("Idle hours exceeded threshold")
    if data["temperature"] > THRESHOLDS["temperature"]:
        errors.append("Temperature exceeded threshold")
    return errors

@router.get("/")
def simulate_vehicle(vehicle_id: str = Query(..., description="Vehicle ID to simulate")):
    if vehicle_id not in VEHICLES:
        return {"error": "Invalid vehicle ID"}

    index = VEHICLE_INDEX[vehicle_id]
    data_points = SIMULATION_DATA[vehicle_id]

    if index >= len(data_points):
        return {"message": "Simulation complete for this vehicle."}

    data_point = data_points[index]
    VEHICLE_INDEX[vehicle_id] += 1

    errors = []
    stop_polling = False
    if VEHICLE_INDEX[vehicle_id] == len(data_points):
        errors = check_thresholds(data_point)
        if errors:
            stop_polling = True  # tell frontend to stop polling

    return {
        "vehicle_id": vehicle_id,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "engine_hours": data_point["engine_hours"],
        "idle_hours": data_point["idle_hours"],
        "temperature": data_point["temperature"],
        "errors": errors,
        "stop_polling": stop_polling  # <-- frontend can check this
    }
