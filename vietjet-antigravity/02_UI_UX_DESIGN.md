# UI/UX Design Specification

## Identity và visual direction
- Tên website trên header: **Vietjet** (demo du lịch; tránh thể hiện là website được hãng bảo trợ).
- Primary `#ee1d23`; background `#ffffff`; section background `#f8f9fb`; text `#20242b`; secondary text `#5e6673`; border `#e6e8ec`; hover red `#c9191e`.
- Typography: system font stack `Inter, Arial, sans-serif` (fallback; không bắt buộc tải Google Fonts).
- Layout: max width 1200px, padding desktop 24px, mobile 16px; khoảng trắng rộng, bo góc 12–16px, shadow nhẹ.
- Responsive breakpoints: 360, 768, 1024, 1440 px; không có horizontal scrolling.

## Thành phần bắt buộc
1. Navbar sticky nhẹ; logo bên trái, nav bên phải, cart badge; menu hamburger trên mobile.
2. Hero desktop 2 cột: nội dung bên trái, ảnh bên phải; mobile thành 1 cột. Form tìm vé trong hero hoặc ngay dưới hero.
3. Form: radio Một chiều/Khứ hồi, dropdown điểm đi/đến, date picker native, CTA đỏ lớn; swap điểm đi/đến (nếu làm được tốt).
4. Tour grid 4 cột desktop / 2 tablet / 1 mobile, tổng 8 card. Ảnh có `width=600 height=400`, `loading=lazy`, `object-fit: cover`, `alt` mô tả, tối ưu URL ảnh `w=600&h=400&fit=crop&auto=format&q=70`.
5. Airline logo strip/grid: căn đều, không làm méo logo, hover highlight. Dùng logo có quyền hoặc placeholder text (không cố lấy tài sản thương hiệu từ domain lạ).
6. Sidebar filters có label, trạng thái selected/clear, đồng bộ URL nếu đơn giản; mobile drawer có nút **Áp dụng** / **Xóa lọc**.
7. Flight/tour listing cards: có giá nổi bật và nút CTA; không dùng màu đỏ cho toàn bộ thông tin.
8. Fare selector: 2 card Phổ thông / Thương gia, hiển thị giá và quyền lợi; radio keyboard accessible.
9. Cart: summary riêng, hành động xóa rõ, form điền, thông báo demo.
10. Feedback: spinner khi tải DB, empty state, lỗi tải DB, toast đã thêm vào giỏ, form validation, confirmation page.

## Hình ảnh
- Ưu tiên ảnh nhẹ `images.unsplash.com` bằng URL ID ảnh hợp lệ, các tour thumbnail 600x400. Nên có fallback gradient/SVG cục bộ nếu ảnh tải lỗi hoặc mạng offline.
- Không dùng hình ảnh như bằng chứng về đúng loại tàu bay, hãng bay hay tiện nghi; ảnh chỉ minh họa.
- Ảnh hero tải `fetchpriority=high` nếu là LCP; ảnh dưới fold `loading=lazy`; không kéo ảnh 4K về màn hình nhỏ.

## Accessibility / chất lượng
- Semantic HTML, `label for`, `aria-expanded`, focus ring rõ, contrast đủ, nút có trạng thái disabled thích hợp, tab keyboard, thông báo lỗi `aria-live`.
- CTA rõ ràng; không tự động đổi lựa chọn người dùng; animation nhẹ và tôn trọng `prefers-reduced-motion`.
- Chú thích gần giá: `Giá demo, chưa bao gồm/đã bao gồm ...` phù hợp dữ liệu mẫu, không khẳng định thuế phí thực tế.

## Copywriting mẫu
Hero headline: **“Bay đến nơi bạn muốn. Khám phá điều bạn yêu.”**
Subtitle: **“Tìm chuyến bay và tour yêu thích, lên kế hoạch hành trình ngay hôm nay.”**
CTA: **“Tìm chuyến bay”**.
Footer: **“Website mẫu phục vụ học tập; không phải hệ thống đặt vé chính thức.”**
