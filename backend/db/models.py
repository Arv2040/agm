from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Equipment(BaseModel):
    id: str  # e.g., "EQX1001"
    type: str # e.g., "Excavator"
    status: str = "Available" # Default status

class RentalCheckout(BaseModel):
    equipment_id: str
    site_id: str
    operator_id: str
    
class UsageLog(BaseModel):
    equipment_id: str
    engine_hours: float
    idle_hours: float
    fuel_level: float