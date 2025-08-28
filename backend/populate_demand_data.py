import random
from db.db_setup import demand_data_collection

def populate_data():
    demand_data_collection.delete_many({})  

    sites = ["Site A", "Site B", "Site C", "Site D"]
    vehicle_types = ["Excavator", "Bulldozer", "Crane", "Loader", "Grader"]

    generated_records = []

    for i in range(1, 101):
        # ---- Choose vehicle type ----
        vehicle_type = random.choice(vehicle_types)

        # ---- Weighted site preference based on vehicle ----
        if vehicle_type == "Excavator":
            location = random.choices(sites, weights=[0.6, 0.2, 0.1, 0.1])[0]  # mostly Site A
        elif vehicle_type == "Loader":
            location = random.choices(sites, weights=[0.1, 0.6, 0.2, 0.1])[0]  # mostly Site B
        elif vehicle_type == "Crane":
            location = random.choices(sites, weights=[0.1, 0.2, 0.6, 0.1])[0]  # mostly Site C
        elif vehicle_type == "Bulldozer":
            location = random.choices(sites, weights=[0.25, 0.25, 0.25, 0.25])[0]  # even
        else:  # Grader
            location = random.choices(sites, weights=[0.2, 0.3, 0.3, 0.2])[0]

        # ---- Base random usage ----
        runtime_hours = random.randint(3, 10)
        idle_hours = random.randint(0, 3)
        fuel_used = int(runtime_hours * random.uniform(5, 9))
        downtime_hours = 1 if random.random() < 0.15 else 0

        # ---- Bias usage values ----
        if vehicle_type == "Excavator" and location == "Site A":
            runtime_hours = random.randint(7, 10)   # works harder here
            fuel_used = int(runtime_hours * random.uniform(8, 10))

        if vehicle_type == "Loader" and location == "Site B":
            runtime_hours = random.randint(6, 9)
            fuel_used = int(runtime_hours * random.uniform(7, 9))

        if vehicle_type == "Bulldozer":
            idle_hours = random.randint(2, 4)  # often idle

        record = {
            "vehicle_id": f"V{i:03}",
            "vehicle_type": vehicle_type,
            "location": location,
            "runtime_hours": runtime_hours,
            "idle_hours": idle_hours,
            "fuel_used": fuel_used,
            "downtime_hours": downtime_hours,
        }

        generated_records.append(record)

    demand_data_collection.insert_many(generated_records)
    print(f"Inserted {len(generated_records)} biased records into 'demand_data'.")

if __name__ == "__main__":
    populate_data()
