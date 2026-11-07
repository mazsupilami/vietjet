# Pages, Routes & Query Contract

## Files cần có

| Trang | Tệp | Hành động chính |
|---|---|---|
| Home | `index.html` | Tìm chuyến bay; xem 8 tour; chọn hãng |
| Flights | `flights.html` | Lọc kết quả; xem chuyến |
| Flight Detail | `flight-detail.html` | Chọn hạng vé; thêm giỏ |
| Tours | `tours.html` | Lọc tour; xem chi tiết |
| Tour Detail | `tour-detail.html` | Xem lịch trình; thêm giỏ |
| Cart | `cart.html` | Xóa, nhập khách, gửi yêu cầu |
| Confirmation | `confirmation.html` | Kết quả đăng ký demo; trạng thái email |

Không dùng thư viện router; mỗi trang HTML load CSS/JS module dùng chung, từ đường dẫn tương đối; hoạt động tại thư mục gốc local static server.

## URL tìm chuyến bay
- `flights.html?from=SGN&to=HAN&departure=2026-12-15&tripType=oneway`
- `flights.html?from=SGN&to=DAD&departure=2026-12-15&return=2026-12-20&tripType=roundtrip`
- `flights.html?airline=VJ`
- `flights.html?tripType=multicity&legs=SGN-HAN-2026-12-15,HAN-DAD-2026-12-18`

**Dates trong ví dụ chỉ minh họa**: dữ liệu seed phải chọn ngày tương lai hợp lý theo ngày chạy để kết quả không bị rỗng ngay khi demo. Không render giá/giờ từ URL khi chưa đối chiếu SQLite.

## URL detail
- `flight-detail.html?id=F001` — tra bảng `flights`, `flight_fares`.
- `tour-detail.html?id=T001` — tra bảng `tours`, `tour_itinerary`.
- ID không tồn tại: hiện thông báo, link về danh sách; không crash.

## Tìm khứ hồi / nhiều thành phố
- Khứ hồi: cần biểu diễn **hai chặng riêng** (đi và về); có thể cho người dùng chọn từng chặng rồi thêm vào giỏ. Nếu chưa chọn đủ, hiển thị trạng thái `Cần chọn chuyến về` và không gọi đây là combo đã hoàn tất.
- Nhiều thành phố: form thêm ít nhất 2 chặng và logic match đúng chuỗi. Không chỉ vẽ checkbox mà không hoạt động.
- Bộ lọc airline, cabin, departure slot phải tìm bằng field trong DB; sort theo giá của `flight_fares` ở cabin được chọn.
- Cần luôn duy trì kết quả khi người dùng Back/Forward; ưu tiên URLSearchParams làm source of truth cho bộ lọc đơn giản.

## Navigation
Navbar link thống nhất ở mọi trang; breadcrumb ở trang detail; cart badge update sau `addCartItem`, `removeCartItem` và `storage` event (nhiều tab).

## Responsive behavior
- Desktop sidebar `col-3`, results `col-9` (có thể CSS grid thuần).
- Mobile sidebar chuyển thành drawer accessible; CTA nút đủ lớn, card xếp dọc; form date không tràn màn hình.
