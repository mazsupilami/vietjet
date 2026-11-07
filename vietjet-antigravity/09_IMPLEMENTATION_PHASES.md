# Kế hoạch triển khai với Antigravity

## Phase 1 — Scaffold, theme và database
**Prompt cho Agent:**

> Đọc toàn bộ PRD, tạo các trang HTML cơ bản và `assets/css/styles.css` với theme đỏ `#ee1d23`, responsive. Tạo file SQLite `assets/data/travel.sqlite` đúng schema trong `04_DATABASE_SQLITE.md`, seed ít nhất 6 hãng, 24 chuyến bay, 8 tour và lịch trình. Tạo `assets/js/db.js` với sql.js WebAssembly. Chạy static preview và chứng minh SELECT hoạt động trên SQLite thực.

**Chấp nhận:** đủ file, DB load trên localhost, seed count đúng, không JS error.

## Phase 2 — Homepage / search / listings
**Prompt cho Agent:**

> Hoàn thiện `index.html`, `flights.html`, `tours.html` đúng PRD. Form bay một chiều/khứ hồi, chọn ngày, điều hướng query params; 8 tour thumbnail 600x400; logo/wordmark hãng; filters flight (sort price, type, direct, multi-city, airline, departure time, cabin) và tour (sort price, airline, departure time) chạy với SQL dữ liệu mẫu. Mobile có filter drawer. Đảm bảo empty states và URL navigation.

**Chấp nhận:** filters không giả, link chính xác, responsive.

## Phase 3 — Details / cart
**Prompt cho Agent:**

> Xây dựng `flight-detail.html`, `tour-detail.html` và `cart.html`. Flight detail hiển thị hãng, loại máy bay, giờ bay, hai fare economy/business có quyền lợi khác nhau. Tour detail có itinerary mỗi ngày. Chọn vé/tour và thêm giỏ localStorage, cập nhật badge, xóa từng item/xóa tất cả, tính tổng chính xác. Không lưu PII trong localStorage.

**Chấp nhận:** add, reload, remove, total đúng.

## Phase 4 — Confirmation/email/QA
**Prompt cho Agent:**

> Xây dựng checkout form, `confirmation.html`, validation + consent, mã tham chiếu DEMO, trạng thái email minh bạch. Tích hợp EmailJS ở chế độ **disabled-by-default** với placeholders và hướng dẫn xác minh sender Gmail `nvhai061993@gmail.com` nếu được phép. Không tự gửi được thì dùng `mailto:` thủ công. Kiểm thử checklist `07_ACCEPTANCE_TESTS.md`, sửa lỗi, ghi README.

**Chấp nhận:** thông báo demo rõ, không gửi email giả, không nhúng credentials, test toàn luồng.

## Khi Agent gặp vấn đề
- Không tải SQLite: chạy dưới local HTTP server, xem Network tab, kiểm tra đường dẫn `.sqlite`, sql-wasm.js và `.wasm` cùng version.
- Không có kết quả vì ngày: seed theo ngày tương lai hoặc hiển thị gợi ý ngày có chuyến, không sửa âm thầm ngày user chọn.
- Không có quyền lấy logo thật: dùng wordmark text, không nhúng hình vi phạm.
- Gửi Gmail thất bại: tắt EmailJS, giữ registration demo và mailto; báo chính xác lý do chưa cấu hình.

## Prompt review cuối cùng

> Bạn là QA độc lập. Đối chiếu từng ô trong `07_ACCEPTANCE_TESTS.md`. Mở trang, thử luồng Home→Flights→Detail→Cart→Confirmation và Home→Tour→Tour Detail→Cart, thử mobile 360px; ghi FAIL cụ thể và tự sửa. Không báo hoàn thành nếu còn button placeholder hoặc dùng JSON thay SQLite.
