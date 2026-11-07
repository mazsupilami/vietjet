import os
import sqlite3
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
SQL_FILE = os.path.join(BASE_DIR, 'init.sql')
OUTPUT_DB = os.path.join(BASE_DIR, 'travel.sqlite')
ASSETS_DATA_DIR = os.path.join(PROJECT_DIR, 'assets', 'data')
ASSETS_DB = os.path.join(ASSETS_DATA_DIR, 'travel.sqlite')

print(f"Reading SQL file: {SQL_FILE}")
with open(SQL_FILE, 'r', encoding='utf-8') as f:
    sql_script = f.read()

if os.path.exists(OUTPUT_DB):
    os.remove(OUTPUT_DB)

print(f"Building SQLite database: {OUTPUT_DB}")
conn = sqlite3.connect(OUTPUT_DB)
cursor = conn.cursor()
cursor.executescript(sql_script)
conn.commit()

# Verify counts
tables = ['airlines', 'airports', 'flights', 'flight_fares', 'travel_agencies', 'tours', 'tour_itinerary']
print("\n--- Database Statistics ---")
for t in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {t}")
    count = cursor.fetchone()[0]
    print(f"Table {t:<18}: {count} records")

conn.close()

# Copy to assets/data/ and sync with db.db
os.makedirs(ASSETS_DATA_DIR, exist_ok=True)
shutil.copyfile(OUTPUT_DB, ASSETS_DB)
DB_DB = os.path.join(BASE_DIR, 'db.db')
try:
    shutil.copyfile(OUTPUT_DB, DB_DB)
except Exception:
    pass
print(f"\nCopied database to: {ASSETS_DB} ({os.path.getsize(ASSETS_DB)} bytes)")
print("SQLite database build SUCCESSFUL!")
