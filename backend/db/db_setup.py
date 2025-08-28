import sqlite3

def create_db():
    conn = sqlite3.connect("equipment.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Equipment (
        EquipmentID TEXT PRIMARY KEY,
        Type TEXT,
        SiteID TEXT,
        CheckOutDate TEXT,
        CheckInDate TEXT,
        EngineHoursPerDay REAL,
        IdleHoursPerDay REAL,
        OperatingDays INTEGER,
        LastOperatorID TEXT,
        Uflag BOOL, 
        Aflag BOOL,
        latitude REAL,
        longitude REAL,
        EngineHoursTotal REAL,
        Fuel_consumed_toal REAL,
        Load_factor_percent REAL
    )
    """)
    #Uflag: Underutilized flag
    #Aflag: Anomaly flag 


    conn.commit()
    conn.close()
    print("✅ Database and table created!")

if __name__ == "__main__":
    create_db()
