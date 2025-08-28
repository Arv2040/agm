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
  

    conn.commit()
    conn.close()
    print("✅ Database and table created!")

if __name__ == "__main__":
    create_db()
