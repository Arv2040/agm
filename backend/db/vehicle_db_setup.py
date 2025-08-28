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

if __name__ == "__main__":
    create_db()
