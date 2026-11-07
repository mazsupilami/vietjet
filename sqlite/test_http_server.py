import http.server
import socketserver
import threading
import urllib.request
import time
import os

PORT = 8089
Handler = http.server.SimpleHTTPRequestHandler

class QuietServer(socketserver.TCPServer):
    allow_reuse_address = True

httpd = QuietServer(("", PORT), Handler)
t = threading.Thread(target=httpd.serve_forever)
t.daemon = True
t.start()
time.sleep(0.5)

urls = [
    '/',
    '/index.html',
    '/flights.html',
    '/flight-detail.html?id=VJ120',
    '/tours.html',
    '/tour-detail.html?id=T001',
    '/cart.html',
    '/confirmation.html',
    '/assets/css/styles.css',
    '/assets/data/travel.sqlite',
    '/images/vietjet-logo.jpg',
    '/images/vietjet-hero.jpg',
    '/assets/images/fallback-tour.svg',
    '/assets/images/airlines/vn.svg',
    '/assets/js/db.js',
    '/assets/js/data-service.js'
]

print("Testing HTTP static server:")
all_ok = True
for path in urls:
    try:
        url = f"http://127.0.0.1:{PORT}{path}"
        req = urllib.request.urlopen(url)
        print(f" - GET {path:<36}: HTTP {req.status} ({len(req.read())} bytes)")
    except Exception as e:
        print(f" - GET {path:<36}: ERROR {e}")
        all_ok = False

httpd.shutdown()
if all_ok:
    print("\nALL HTTP STATIC ASSETS AND PAGES ARE SERVING 200 OK!")
else:
    print("\nSOME ASSETS FAILED!")
