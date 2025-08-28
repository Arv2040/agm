import sqlite3
import os

def create_db():

    db_path = "agm.db"
    if os.path.exists(db_path):
        print("ℹ️ Database already exists. No action taken.")
        return
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Company (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        industry TEXT NOT NULL,
        credit_rating TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        person_of_contact TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Vehicles (
        vehicle_id      TEXT PRIMARY KEY,              -- Unique ID (e.g. CAT123)
        type            TEXT NOT NULL,                 -- Excavator, Loader, etc.
        model           TEXT,
        year            INTEGER,
        status          TEXT DEFAULT 'available' CHECK(status IN ('available','rented','maintenance'))
    )
""")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rental (
        rental_id INTEGER PRIMARY KEY AUTOINCREMENT,
        comp_id INTEGER,
        vehicle_id INTEGER,
        rental_date DATETIME NOT NULL,
        return_date DATETIME,
        price REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'active', -- e.g., 'active', 'completed', 'cancelled'
        location TEXT,
        FOREIGN KEY (comp_id) REFERENCES company(comp_id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)
    )
    """)

    conn.commit()
    conn.close()
    print("✅ Database and tables created successfully!")

if __name__ == "__main__":
    create_db()
