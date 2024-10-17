from fastapi import FastAPI
import sqlite3
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path for the database file in the same directory as the script
db_path = os.path.join(script_dir, 'database_sample_data.db')

print("Current working directory:", os.getcwd())
# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
# Create a new table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS kpis (
        Timestamp TEXT,
        User_ID INTEGER,
        Application_Type TEXT,
        Signal_Strength INTEGER,
        Latency INTEGER,
        Required_Bandwidth INTEGER,
        Allocated_Bandwidth INTEGER,
        Resource_Allocation INTEGER
    )
''')

# Data to be inserted
data = [
    ('9/25/2024 10:00', 1001, 'Streaming', -85, 30, 10, 8, 75),
    ('9/25/2024 10:05', 1002, 'Gaming', -80, 25, 15, 10, 80),
    ('9/25/2024 10:10', 1003, 'Browsing', -90, 20, 5, 4, 60),
    ('9/25/2024 10:15', 1004, 'Streaming', -70, 40, 20, 18, 90),
    ('9/25/2024 10:20', 1005, 'Gaming', -75, 35, 18, 16, 85),
    ('9/25/2024 10:25', 1006, 'Browsing', -95, 22, 6, 5, 65),
    ('9/25/2024 10:30', 1007, 'Streaming', -65, 28, 12, 9, 78),
    ('9/25/2024 10:35', 1008, 'Gaming', -78, 33, 17, 14, 82),
    ('9/25/2024 10:40', 1009, 'Browsing', -88, 24, 7, 6, 68),
    ('9/25/2024 10:45', 1010, 'Streaming', -72, 38, 19, 17, 88),
    ('9/25/2024 10:50', 1011, 'Gaming', -74, 32, 16, 15, 83),
    ('9/25/2024 10:55', 1012, 'Browsing', -92, 26, 8, 7, 66)
]

# Insert data into the table
cursor.executemany('''
    INSERT INTO kpis (Timestamp, User_ID, Application_Type, Signal_Strength, Latency, Required_Bandwidth, Allocated_Bandwidth, Resource_Allocation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
''', data)

# Commit the transaction
conn.commit()

# Close the connection
conn.close()

print("Database and table created, and data inserted successfully.")

def get_db_connection():
    conn = sqlite3.connect('d:\\UTD\\24Fall\\CS4485\\AG-T5\\my-app\\src\\database_sample_data.db')
    conn.row_factory = sqlite3.Row
    return conn
