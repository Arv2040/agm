import random
from db.db_setup import demand_data_collection

def populate_data():
    demand_data_collection.delete_many({})  # Clear old records

    sites = ["Site A", "Site B", "Site C", "Site D"]

    # Equipment list with types
    equipment = {
        "CAT336": "Hydraulic Excavator",
        "CAT349": "Hydraulic Excavator",
        "CATD8T": "Dozer",
        "CATD11": "Large Dozer",
        "CAT950M": "Wheel Loader",
        "CAT299D3": "Compact Track Loader",
        "CAT797F": "Mining Truck",
        "CAT140M": "Motor Grader",
    }

    generated_records = []

    for i in range(1, 101):  # Generate 100 records
        machine_id = random.choice(list(equipment.keys()))
        machine_type = equipment[machine_id]

        # ---- Site preferences (bias) ----
        if machine_type == "Hydraulic Excavator":
            location = random.choices(sites, weights=[0.7, 0.1, 0.1, 0.1])[0]  # mostly Site A
        elif "Dozer" in machine_type:
            location = random.choices(sites, weights=[0.1, 0.7, 0.1, 0.1])[0]  # mostly Site B
        elif "Loader" in machine_type or "Grader" in machine_type:
            location = random.choices(sites, weights=[0.1, 0.1, 0.7, 0.1])[0]  # mostly Site C
        elif machine_type == "Mining Truck":
            location = "Site D"  # Mining trucks mostly at Site D
        else:
            location = random.choice(sites)

        # ---- Base usage ----
        runtime_hours = random.randint(3, 10)
        idle_hours = random.randint(0, 3)
        fuel_used = int(runtime_hours * random.uniform(5, 9))
        downtime_hours = 1 if random.random() < 0.15 else 0

        # ---- Bias usage by type ----
        if "Excavator" in machine_type and location == "Site A":
            runtime_hours = random.randint(7, 10)
            fuel_used = int(runtime_hours * random.uniform(8, 10))

        if "Dozer" in machine_type and location == "Site B":
            runtime_hours = random.randint(6, 9)
            fuel_used = int(runtime_hours * random.uniform(7, 9))

        if "Loader" in machine_type:
            idle_hours = random.randint(2, 4)  # loaders idle more

        if "Mining Truck" in machine_type:
            runtime_hours = random.randint(8, 12)
            fuel_used = int(runtime_hours * random.uniform(15, 20))  # mining trucks use more fuel

        record = {
            "machine_id": machine_id,   # use this instead of _id
            "type": machine_type,
            "location": location,
            "runtime_hours": runtime_hours,
            "idle_hours": idle_hours,
            "fuel_used": fuel_used,
            "downtime_hours": downtime_hours,
            "status": "Available" if random.random() > 0.1 else "Maintenance"  # 10% chance in maintenance
        }

        generated_records.append(record)

    demand_data_collection.insert_many(generated_records)
    print(f"Inserted {len(generated_records)} biased records into 'demand_data'.")

if __name__ == "__main__":
    populate_data()
