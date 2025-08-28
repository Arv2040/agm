import sqlite3

def create_db():
    conn = sqlite3.connect("agm.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Vehicles (
        vehicle_id      TEXT PRIMARY KEY,              -- Unique ID (e.g. CAT123)
        type            TEXT NOT NULL,                 -- Excavator, Loader, etc.
        model           TEXT,
        year            INTEGER,
        status          TEXT DEFAULT 'available' CHECK(status IN ('available','rented','maintenance'))
    )
""")

    


    conn.commit()
    conn.close()
    print("✅ Database and table created!")


def add_data():
    conn = sqlite3.connect("agm.db")
    cursor = conn.cursor()

    vehicles = [
        ("EX001", "Excavator", "CAT 320D", 2021, "available"),
        ("LD002", "Loader", "Komatsu WA320", 2019, "rented"),
        ("BL003", "Bulldozer", "Komatsu D85", 2020, "maintenance"),
        ("CR004", "Crane", "Liebherr LTM 1100", 2018, "available"),
        ("TR005", "Tractor", "John Deere 5075E", 2022, "available"),
        ("RT006", "Road Roller", "HAMM HD 12", 2017, "rented"),
        ("EX007", "Excavator", "Volvo EC210", 2020, "available"),
        ("LD008", "Loader", "CAT 950H", 2016, "available"),
        ("DG009", "Drill Rig", "Sandvik DP1500i", 2021, "maintenance"),
        ("EX010", "Excavator", "Hitachi ZX200", 2019, "rented")
    ]

    try:
        cursor.executemany("""
            INSERT INTO Vehicles (vehicle_id, type, model, year, status)
            VALUES (?, ?, ?, ?, ?)
        """, vehicles)
        conn.commit()
        print("Sample data added successfully!")
    except Exception as e:
        print("Error inserting data:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    create_db()
    add_data()
