# SQLite Data Model & Browser Access

## Quyết định kiến trúc
Ứng dụng **frontend-only**. Sử dụng [`sql.js`](https://sql.js.org/) chạy SQLite qua WebAssembly ngay trong browser. File `assets/data/travel.sqlite` là **snapshot dữ liệu demo chỉ đọc** được tải bằng `fetch`. Không được dùng trực tiếp SQLite native library, Node SQLite package, REST API tự tạo hoặc server database. Mọi sửa giỏ hàng lưu `localStorage` (không ghi đè file SQLite).

## Mô hình quan hệ

```text
airlines 1---n flights 1---n flight_fares
                   | 
                   n---1 airports (origin)
                   n---1 airports (destination)
travel_agencies 1---n tours 1---n tour_itinerary
                        |  
                        n---1 airlines (nullable)
                        n---1 airports (departure, destination, nullable)
```

## SQLite schema yêu cầu

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE airlines (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_color TEXT
);

CREATE TABLE airports (
  code TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE flights (
  id TEXT PRIMARY KEY,
  airline_code TEXT NOT NULL REFERENCES airlines(code),
  flight_number TEXT NOT NULL,
  origin_code TEXT NOT NULL REFERENCES airports(code),
  destination_code TEXT NOT NULL REFERENCES airports(code),
  departure_at TEXT NOT NULL,
  arrival_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK(duration_minutes > 0),
  stops INTEGER NOT NULL DEFAULT 0 CHECK(stops >= 0),
  aircraft_model TEXT NOT NULL,
  checked_baggage_note TEXT,
  cabin_baggage_note TEXT,
  status TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE flight_fares (
  id TEXT PRIMARY KEY,
  flight_id TEXT NOT NULL REFERENCES flights(id),
  cabin TEXT NOT NULL CHECK(cabin IN ('economy','business')),
  price_vnd INTEGER NOT NULL CHECK(price_vnd >= 0),
  carry_on_kg INTEGER,
  checked_baggage_kg INTEGER,
  change_policy TEXT,
  refund_policy TEXT,
  UNIQUE(flight_id, cabin)
);

CREATE TABLE travel_agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  agency_id TEXT NOT NULL REFERENCES travel_agencies(id),
  airline_code TEXT REFERENCES airlines(code),
  origin_code TEXT REFERENCES airports(code),
  destination_code TEXT REFERENCES airports(code),
  departure_at TEXT,
  flight_duration_minutes INTEGER,
  aircraft_model TEXT,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  price_vnd INTEGER NOT NULL CHECK(price_vnd >= 0),
  image_url TEXT,
  included_services TEXT,
  excluded_services TEXT,
  cancellation_policy TEXT,
  featured INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tour_itinerary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tour_id TEXT NOT NULL REFERENCES tours(id),
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  UNIQUE(tour_id, day_number)
);

CREATE INDEX idx_flights_route_departure ON flights(origin_code, destination_code, departure_at);
CREATE INDEX idx_flights_airline ON flights(airline_code);
CREATE INDEX idx_tours_featured ON tours(featured);
```

Thời gian: ISO 8601 có offset (`2026-12-15T08:00:00+07:00`) để tránh lệch timezone. Giá lưu integer VND. Giá demo có thể ghi rõ đã/chưa bao gồm phí theo chính sách mẫu.

## Seed data
- Ít nhất **6 hãng**: VJ Vietjet Air, VN Vietnam Airlines, SQ Singapore Airlines, QH Bamboo Airways, VU Vietravel Airlines, TR Scoot (dữ liệu branding phải được kiểm tra / dùng wordmark placeholder nếu cần).
- Ít nhất **8 sân bay**: SGN, HAN, DAD, CXR, PQC, DLI, SIN, BKK.
- Ít nhất **24 chuyến bay** cả nội địa/quốc tế, 2 hạng vé mỗi chuyến nếu có dữ liệu, chiều đi và chiều về ở một số chặng, có cả bay thẳng và 1 điểm dừng. Chọn thời gian demo tương lai, hoặc dựng bằng script seed vào lúc build.
- Ít nhất **8 tours featured**: Phú Quốc, Đà Nẵng–Hội An, Đà Lạt, Nha Trang, Hà Nội–Hạ Long, Bangkok, Singapore, Bali. Có giá, ảnh 600:400, hãng lữ hành, day/night, và lịch trình mỗi ngày.
- Không gán một hãng hay loại tàu bay không chắc chắn vào các hành trình thực tế: dữ liệu demo có nhãn “minh họa”.

## Bootstrap DB trong browser (mã tham khảo)

Dùng bản UMD của `sql.js` qua CDN (không `import` như ESM nếu CDN không hỗ trợ):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js"></script>
```

```js
async function loadDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`
  });
  const response = await fetch('./assets/data/travel.sqlite');
  if (!response.ok) throw new Error('Không tải được dữ liệu mẫu');
  return new SQL.Database(new Uint8Array(await response.arrayBuffer()));
}
// Chỉ sử dụng query có tham số để tránh SQL injection.
```

Chỉ sử dụng script CDN sau khi kiểm tra URL hoạt động, có thể pin phiên bản và lưu bản nội bộ nếu môi trường offline. Không tạo database trên từng máy bằng backend. Database demo có thể sinh **lúc phát triển** bằng script riêng nhưng chỉ deliver `.sqlite` và static assets cho runtime.

## Query mẫu

```sql
SELECT f.id, a.name AS airline, f.departure_at,
       f.origin_code, f.destination_code, f.duration_minutes, f.stops,
       MIN(ff.price_vnd) AS from_price
FROM flights f
JOIN airlines a ON a.code = f.airline_code
JOIN flight_fares ff ON ff.flight_id = f.id
WHERE f.status = 'available'
GROUP BY f.id
ORDER BY from_price ASC;
```

Dùng `stmt.bind([...])` cho điều kiện lọc động. `stmt.free()` sau khi sử dụng. Xử lý lỗi CDN/SQLite bằng màn hình lỗi có Retry, không bỏ qua để hiển thị kết quả giả.
