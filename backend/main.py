from fastapi import FastAPI
from .routers import equipment, rentals, operators, anomalies,demand

app = FastAPI(
    title="Smart Rental Tracking API",
    description="API for managing and tracking rental equipment with smart analytics.",
    version="1.0.0"
)

# --- Include Routers from other files ---
app.include_router(
    equipment.router, 
    prefix="/equipment", 
    tags=["Equipment"]
)
app.include_router(
    rentals.router, 
    prefix="/rentals", 
    tags=["Rentals"]
)
app.include_router(
    operators.router,
    prefix="/operators",
    tags=["Operators"]
)
app.include_router(
    anomalies.router, 
    prefix="/anomalies", 
    tags=["Anomalies & Usage"]
)
app.include_router(
    demand.router,
    prefix="/demand",
    tags=["demand"]
)
# Root endpoint
@app.get("/", tags=["Root"])
def home():
    return {"message": "Welcome to the Smart Rental Tracking API 🚀"}