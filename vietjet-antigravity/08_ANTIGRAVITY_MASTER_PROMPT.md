# MASTER PROMPT — Dán vào Antigravity Agent

Bạn là Senior Frontend Engineer + UI/UX Designer + QA Engineer. Hãy **xây dựng mã nguồn hoàn chỉnh** của website demo **“Vietjet Travel”** từ các đặc tả có sẵn trong thư mục dự án.

## Đọc tài liệu theo thứ tự
1. `00_START_HERE.md`
2. `01_PRODUCT_REQUIREMENTS.md`
3. `02_UI_UX_DESIGN.md`
4. `03_PAGES_AND_ROUTES.md`
5. `04_DATABASE_SQLITE.md`
6. `05_ARCHITECTURE.md`
7. `06_BOOKING_AND_EMAIL.md`
8. `07_ACCEPTANCE_TESTS.md`
9. `09_IMPLEMENTATION_PHASES.md`

## Ràng buộc KHÔNG được vi phạm
- HTML5, CSS3, **Vanilla JavaScript**; không React/Vue/Next/Angular/TypeScript, không backend ứng dụng.
- Dùng SQLite qua `sql.js` WebAssembly chạy **trong browser**, đọc `assets/data/travel.sqlite`. Tạo tệp `.sqlite` thật có schema và seed dữ liệu, không thay thế bằng JSON hardcoded.
- Dữ liệu demo: ≥6 hãng, ≥24 chuyến bay, 2 fare classes khả dụng, ≥8 tours featured với itinerary; test filter và flow end-to-end.
- Màu primary `#ee1d23`, thiết kế sáng, responsive, sạch, CTA nổi bật.
- Trang HTML riêng: `index.html`, `flights.html`, `flight-detail.html`, `tours.html`, `tour-detail.html`, `cart.html`, `confirmation.html`.
- Ảnh tour 600×400, tối ưu dung lượng; lazy load. Logo hãng nếu không đủ quyền dùng thì wordmark/placeholder có nhãn.
- Giỏ hàng lưu localStorage, không lưu thông tin cá nhân dài hạn; email tùy chọn EmailJS cấu hình bằng placeholders, không nhúng Gmail password. Không giả trạng thái email đã gửi.
- Website dùng dữ liệu giả lập; không mạo nhận là website chính thức Vietjet hoặc dịch vụ đặt vé thật.

## Cách thực hiện
1. Đọc đủ tài liệu, lập checklist ngắn rồi tạo cấu trúc dự án.
2. Tạo SQLite schema và seed thực tế về mặt cấu trúc (nhưng số liệu/giờ bay/tour đều ghi **demo**), thời gian tương lai phù hợp ngày test.
3. Implement data-service và shared UI trước, sau đó từng trang. Sử dụng query parameter để điều hướng.
4. Implement flight search, tất cả filter, sort, fare detail, tour list + itinerary, giỏ hàng và form đăng ký.
5. Implement EmailJS optional + mailto fallback đúng điều kiện, hiển thị email status trung thực.
6. Test bằng trình duyệt trên local HTTP server (chỉ phục vụ tệp static), sửa lỗi runtime, link hỏng, giao diện mobile, console.
7. Viết `README.md` hướng dẫn chạy, cấu hình email, kiến trúc và giới hạn demo.

## Nguyên tắc thực thi
- **Không chỉ trả lời bằng hướng dẫn hoặc pseudocode**: tạo các tệp source thực tế trong workspace.
- **Không bỏ qua** filter khó (`roundtrip`, `multicity`); nếu data thiếu, báo rõ empty state; không làm UI giả.
- Mọi CTA phải dẫn đến trang/hoạt động được.
- Ưu tiên hoàn thiện luồng đặt chỗ demo hơn animation.
- Nếu một yêu cầu xung đột kỹ thuật, làm theo phần giải pháp được giải thích trong đặc tả; không tự ý thêm backend.
- Kết thúc: cho biết danh sách file, đường dẫn chạy thử, tình trạng tests, giới hạn và những cấu hình người dùng cần cung cấp riêng cho EmailJS.
