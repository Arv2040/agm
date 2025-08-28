from pymongo import MongoClient
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# --- Best Practice: Use Environment Variables ---
# Create a file named .env and add your credentials there
# MONGO_USER="gurnoora51"
# MONGO_PASS="Ggg@6350107686"
load_dotenv() 

username = "gurnoora51"
password = "Ggg@6350107686"
escaped_password = quote_plus(password)

MONGO_URI = f"mongodb+srv://{username}:{escaped_password}@devtinder.npbge.mongodb.net/?retryWrites=true&w=majority&appName=devtinder"
client = MongoClient(MONGO_URI)

# Get the database
db = client["rental_system_db"] 
demand_collection = db["demand_data"]
# Define separate collections for your models
equipment_collection = db["equipment"]
rentals_collection = db["rentals"]
usage_logs_collection = db["usage_logs"]

operators_collection = db["operators"]

print("✅ Connected to MongoDB.")