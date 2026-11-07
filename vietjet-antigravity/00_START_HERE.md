# VIETJET Travel — Bắt đầu với Antigravity

## Mục tiêu
Tạo website demo du lịch đặt chuyến bay và tour, thương hiệu giao diện **Vietjet**, chỉ dùng **HTML5, CSS3, JavaScript thuần** (không React, Vue, Node server, PHP, Python backend), nền trắng sáng, màu nhấn `#ee1d23`. Nội dung tiếng Việt, đơn vị VND, múi giờ Asia/Ho_Chi_Minh.

> Đây là dự án **demo/prototype**, không phải website chính thức của hãng Vietjet Air. Không dùng nhãn hiệu theo cách gây hiểu lầm là đại lý ủy quyền; chỉ dùng logo/ảnh có quyền sử dụng hoặc placeholder. Giá chuyến bay/tour là **dữ liệu mẫu**, không phải giá bán thời gian thực.

## Những file Markdown này dùng để làm gì?

| File | Vai trò |
|---|---|
| `01_PRODUCT_REQUIREMENTS.md` | Yêu cầu nghiệp vụ và luồng người dùng |
| `02_UI_UX_DESIGN.md` | Giao diện, responsive, thành phần, hình ảnh |
| `03_PAGES_AND_ROUTES.md` | Chi tiết từng trang, tham số URL và hành vi |
| `04_DATABASE_SQLITE.md` | Schema SQLite, seed data, truy cập từ browser |
| `05_ARCHITECTURE.md` | Cấu trúc source, state, bộ lọc, validation |
| `06_BOOKING_AND_EMAIL.md` | Giỏ hàng, form khách, xác nhận và email |
| `07_ACCEPTANCE_TESTS.md` | Tiêu chí kiểm thử và checklist nghiệm thu |
| `08_ANTIGRAVITY_MASTER_PROMPT.md` | Prompt tổng để dán vào Antigravity |
| `09_IMPLEMENTATION_PHASES.md` | Trình tự thực hiện và prompt từng giai đoạn |

## Điểm kỹ thuật quan trọng
1. **SQLite trên trình duyệt:** dùng `sql.js` (SQLite biên dịch WebAssembly, nạp bằng CDN) để đọc file `assets/data/travel.sqlite` qua `fetch`. Không có backend. Truy cập trang qua **local static server** để `fetch` và WASM hoạt động; không đảm bảo chạy khi mở `file://`.
2. **Lưu thay đổi:** cơ sở dữ liệu SQLite được đọc vào bộ nhớ; chỉ lưu giỏ hàng bằng `localStorage`. Không được quảng cáo rằng SQLite tự ghi bền vào file trên máy người dùng.
3. **Email:** website thuần frontend **không thể tự gửi email từ `nvhai061993@gmail.com`** nếu không dùng dịch vụ gửi email được cấu hình và xác thực. Đưa tích hợp **EmailJS (tùy chọn)** với tài khoản/sender đã xác minh; nếu chưa cấu hình, chỉ demo hoàn tất và nút `mailto:` mở ứng dụng mail, không tuyên bố đã gửi. Không lưu hoặc nhúng mật khẩu Gmail.
4. Không tích hợp thanh toán, xuất vé thật hoặc xuất booking vào hệ thống hãng.

## Bắt đầu
1. Tạo workspace `vietjet-travel` trong Antigravity.
2. Đưa toàn bộ các file `.md` trong bộ này vào thư mục gốc workspace.
3. Mở `08_ANTIGRAVITY_MASTER_PROMPT.md`, sao chép prompt vào Antigravity Agent.
4. Yêu cầu Agent tạo toàn bộ source code, SQLite demo, assets, README và kiểm thử theo `07_ACCEPTANCE_TESTS.md`.
5. Preview trên localhost/static server (ví dụ VS Code Live Server hoặc `python -m http.server 5500` chỉ để phục vụ file tĩnh trong lúc phát triển; đây **không phải backend ứng dụng**).

## Ưu tiên bàn giao
Chạy được end-to-end: Trang chủ → Danh sách → Chi tiết → Thêm giỏ → Nhập thông tin → Xác nhận. Không hiển thị trạng thái “email đã gửi” trừ khi dịch vụ thực sự trả về thành công.
