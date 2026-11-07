import os, sqlite3

def check_tour(db_path):
    if not os.path.exists(db_path):
        print(f"{db_path}: NOT FOUND")
        return
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("SELECT id, title, price_vnd FROM tours WHERE id = 'T003'")
        row = cur.fetchone()
        print(f"{db_path}: {row}")
        conn.close()
    except Exception as e:
        print(f"{db_path}: ERROR {e}")

check_tour(os.path.join('assets', 'data', 'travel.sqlite'))
check_tour(os.path.join('sqlite', 'travel.sqlite'))
check_tour(os.path.join('sqlite', 'db.db'))
