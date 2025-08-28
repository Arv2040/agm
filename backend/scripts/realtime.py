from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
import random

app = FastAPI()

class SimulationRequest(BaseModel):
    vehicle_id: str
    machine_type: str

@app.post("/simulate")
def simulate_machine(req: SimulationRequest):
    usage_hours = random.uniform(0.1, 0.5)
    idle_fraction = random.uniform(0.2, 0.6)

    engine_hours_today = round(usage_hours * random.randint(5, 20), 2)
    idle_hours_today = round(engine_hours_today * idle_fraction, 2)
    productive_hours_today = round(engine_hours_today - idle_hours_today, 2)

    fuel_consumption_rate_work = 0.6
    fuel_consumption_rate_idle = 0.25
    fuel_used = (productive_hours_today * fuel_consumption_rate_work) + \
                (idle_hours_today * fuel_consumption_rate_idle)
    fuel_level = max(0, 100 - fuel_used)

    temperature = round(70 + (productive_hours_today * 0.3) + random.uniform(-2, 2), 2)

    return {
        "vehicle_id": req.vehicle_id,
        "machine": req.machine_type,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "engine_hours_today": engine_hours_today,
        "idle_hours_today": idle_hours_today,
        "productive_hours_today": productive_hours_today,
        "operating_days": random.randint(1, 365),
        "fuel_level": round(fuel_level, 2),
        "temperature": temperature
    }
