from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import equipment, rentals, operators, anomalies, demand, realtime, expose_demand, infer

app = FastAPI(
    title="Smart Rental Tracking API",
    description="API for managing and tracking rental equipment with smart analytics.",
    version="1.0.0"
)

# --- CORS Configuration ---
origins = [
    "http://localhost",
    "http://localhost:3000",  # React/Next.js frontend
    "http://127.0.0.1:3000",
    "*",  # Allow all origins (for testing; remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allow all headers
)

# --- Include Routers ---
app.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])
app.include_router(rentals.router, prefix="/rentals", tags=["Rentals"])
app.include_router(operators.router, prefix="/operators", tags=["Operators"])
app.include_router(anomalies.router, prefix="/anomalies", tags=["Anomalies & Usage"])
app.include_router(demand.router, prefix="/demand", tags=["Demand"])
app.include_router(realtime.router, prefix="/anomaly", tags=["Anomaly Detection"])
app.include_router(expose_demand.router, prefix="/expose_demand", tags=["Expose Demand"])
app.include_router(infer.router,prefix = "/infer")

# --- Root endpoint ---
@app.get("/", tags=["Root"])
def home():
    return {"message": "Welcome to the Smart Rental Tracking API 🚀"}
