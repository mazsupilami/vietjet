import os
import sqlite3

db_path = os.path.join('assets', 'data', 'travel.sqlite')
assert os.path.exists(db_path), f"Missing {db_path}!"

conn = sqlite3.connect(db_path)
cur = conn.cursor()

checks = {
    'airlines': 6,
    'airports': 8,
    'flights': 24,
    'flight_fares': 48,
    'travel_agencies': 4,
    'tours': 8,
    'tour_itinerary': 8
}

print("Verifying SQLite Database:")
all_passed = True
for table, min_count in checks.items():
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    cnt = cur.fetchone()[0]
    status = "OK" if cnt >= min_count else "FAIL"
    print(f" - Table {table:<16}: {cnt:>2} rows (min: {min_count:>2}) -> {status}")
    if cnt < min_count:
        all_passed = False

cur.execute("SELECT flight_id, COUNT(DISTINCT cabin) FROM flight_fares GROUP BY flight_id HAVING COUNT(DISTINCT cabin) < 2")
bad_fares = cur.fetchall()
if len(bad_fares) == 0:
    print(" - All flights have both Economy & Business fares -> OK")
else:
    print(f" - Flights missing fares: {bad_fares} -> FAIL")
    all_passed = False

cur.execute("SELECT COUNT(*) FROM tours WHERE featured = 1")
featured_cnt = cur.fetchone()[0]
print(f" - Featured tours: {featured_cnt} (min: 8) -> {'OK' if featured_cnt >= 8 else 'FAIL'}")

# Verify specific test dates from 03_PAGES_AND_ROUTES.md:
# 1. SGN -> HAN on 2026-12-15
cur.execute("SELECT COUNT(*) FROM flights WHERE origin_code='SGN' AND destination_code='HAN' AND substr(departure_at, 1, 10)='2026-12-15'")
cnt = cur.fetchone()[0]
print(f" - Flights SGN->HAN on 2026-12-15: {cnt} -> {'OK' if cnt > 0 else 'FAIL'}")

# 2. SGN -> DAD on 2026-12-15
cur.execute("SELECT COUNT(*) FROM flights WHERE origin_code='SGN' AND destination_code='DAD' AND substr(departure_at, 1, 10)='2026-12-15'")
cnt = cur.fetchone()[0]
print(f" - Flights SGN->DAD on 2026-12-15: {cnt} -> {'OK' if cnt > 0 else 'FAIL'}")

# 3. DAD -> SGN on 2026-12-20 (Roundtrip)
cur.execute("SELECT COUNT(*) FROM flights WHERE origin_code='DAD' AND destination_code='SGN' AND substr(departure_at, 1, 10)='2026-12-20'")
cnt = cur.fetchone()[0]
print(f" - Flights DAD->SGN on 2026-12-20: {cnt} -> {'OK' if cnt > 0 else 'FAIL'}")

# 4. HAN -> DAD on 2026-12-18 (Multicity leg 2)
cur.execute("SELECT COUNT(*) FROM flights WHERE origin_code='HAN' AND destination_code='DAD' AND substr(departure_at, 1, 10)='2026-12-18'")
cnt = cur.fetchone()[0]
print(f" - Flights HAN->DAD on 2026-12-18: {cnt} -> {'OK' if cnt > 0 else 'FAIL'}")

# Check 1-stop flights
cur.execute("SELECT COUNT(*) FROM flights WHERE stops = 1")
stops_cnt = cur.fetchone()[0]
print(f" - 1-stop flights: {stops_cnt} -> {'OK' if stops_cnt > 0 else 'FAIL'}")

conn.close()

if all_passed:
    print("\nALL DATABASE TESTS PASSED 100%!")
else:
    print("\nSOME TESTS FAILED!")
