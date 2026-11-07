# Frontend Architecture — HTML/CSS/Vanilla JS

## Ràng buộc bắt buộc
- Chỉ HTML/CSS/JavaScript thuần; có thể dùng Bootstrap **CSS qua CDN** cho layout nếu muốn, không bắt buộc.
- **Không backend**: không Node.js server, Express, Next.js, PHP, Python Flask, Firebase Functions, Supabase server, API bí mật.
- SQLite (sql.js/WASM) dữ liệu chỉ đọc runtime; `localStorage` giữ giỏ hàng. Không đưa dữ liệu khách vào SQLite demo.
- Không dùng React/Vue/TypeScript/build pipeline trừ khi người dùng đổi yêu cầu.

## Source tree kỳ vọng

```text
vietjet-travel/
├── index.html
├── flights.html
├── flight-detail.html
├── tours.html
├── tour-detail.html
├── cart.html
├── confirmation.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── data-service.js
│   │   ├── format.js
│   │   ├── navigation.js
│   │   ├── cart.js
│   │   ├── home.js
│   │   ├── flights.js
│   │   ├── flight-detail.js
│   │   ├── tours.js
│   │   ├── tour-detail.js
│   │   ├── checkout.js
│   │   └── confirmation.js
│   ├── data/travel.sqlite
│   └── images/fallback-tour.svg
├── README.md
└── [the supplied specification .md files]
```

## State và dữ liệu
- `db.js`: initialize singleton SQL.Database, helper prepared queries, handle loading/error.
- `data-service.js`: pure data selectors cho flights, fares, tours, itinerary, airlines; định dạng thời gian date local đúng offset.
- `cart.js`: versioned localStorage schema `vietjet_demo_cart_v1` với structure:

```json
{
  "version": 1,
  "items": [
    {"type":"flight","id":"F001","fareId":"FF001E","quantity":1,"unitPriceVnd":1290000},
    {"type":"tour","id":"T001","departureAt":"2026-12-20","quantity":2,"unitPriceVnd":4990000}
  ]
}
```

Giá snapshot được dùng để hiển thị nhưng khi render phải đối chiếu ID và loại giá từ DB; cảnh báo nếu dữ liệu thay đổi. Không lưu PII ở `localStorage`.
- `checkout.js`: validate form, sinh `DEMO-YYYYMMDD-XXXX` client-side; không cam kết uniqueness toàn hệ thống. Chỉ cho hoàn tất nếu có ít nhất 1 item, form hợp lệ và user đồng ý.
- Sau khi xác nhận: chỉ xóa giỏ khi thành công theo yêu cầu nghiệp vụ; hiển thị summary trên confirmation bằng `sessionStorage` hạn chế PII (ưu tiên chỉ tham chiếu và trạng thái gửi, không lưu full form).

## Filtering và sorting
- Price sort thay đổi thứ tự, không phải ngưỡng giá (có thể bổ sung price range).
- Departure time: các bucket `00:00–05:59`, `06:00–11:59`, `12:00–17:59`, `18:00–23:59` tính theo giờ **địa phương của sân bay khởi hành** nếu có offset, không lấy UTC.
- Direct only = `stops === 0`.
- Economy/business filter dựa trên fare records, không hardcode.
- Tours airlines và departure time lọc theo `tours.airline_code`, `tours.departure_at`; tour không có chuyến bay hiển thị “Không bao gồm vé máy bay” thay vì suy diễn.
- Return flight/multicity cần lọc theo chuỗi chặng, không đánh đồng với một flight record.

## Security và privacy
- Mọi dynamic text dùng `textContent` hoặc escape, không ghép HTML chưa kiểm soát; JS params validate; tránh XSS.
- Không lưu khóa riêng, Gmail password hoặc token bí mật trong `config.js`. Public keys của provider client-only có thể xuất hiện nhưng phải hạn chế domain/rate limit tại provider.
- Dữ liệu khách chỉ dùng để xác nhận, không gửi đến endpoint không được cấu hình minh bạch; có consent checkbox.
- Nếu cần production booking thật, phải bổ sung backend đáng tin cậy, inventory/API hãng, thanh toán, anti-fraud và bảo vệ dữ liệu.

## Error states
Mất CDN/sql.js, tải `.sqlite` lỗi, ID không hợp lệ, ảnh lỗi, dữ liệu rỗng, email provider lỗi, mạng offline. Người dùng luôn có đường quay lại.
