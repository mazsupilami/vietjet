# PRD — VIETJET Travel

## 1. Tổng quan
Website demo tìm kiếm/đặt chỗ chuyến bay và tour. Phục vụ người dùng tại Việt Nam; tối ưu desktop, tablet, mobile. Ứng dụng không có backend, dữ liệu từ SQLite demo chạy trong trình duyệt.

## 2. Sitemap và luồng chính

```text
index.html (Trang chủ)
 ├── flights.html?from=SGN&to=HAN&departure=...&tripType=oneway
 │    └── flight-detail.html?id=F001 → cart.html
 ├── flights.html?airline=VJ
 ├── tours.html
 │    └── tour-detail.html?id=T001 → cart.html
 └── cart.html → confirmation.html
```

## 3. Trang chủ
- Header: chữ logo `Vietjet`, menu `Trang chủ`, `Chuyến bay`, `Tour du lịch`, `Giỏ hàng`; biểu tượng giỏ hiển thị số sản phẩm.
- Hero: headline thu hút, mô tả ngắn, ảnh du lịch/hàng không được phép sử dụng; màu nền trắng/nhạt và đỏ `#ee1d23` cho CTA.
- Form tìm chuyến bay: điểm khởi hành, điểm đến, ngày đi, ngày về (chỉ hiện khi khứ hồi), lựa chọn **Một chiều / Khứ hồi**. Điểm đi khác điểm đến; ngày không ở quá khứ; ngày về >= ngày đi. Nút **Tìm kiếm** tới `flights.html` và giữ các điều kiện ở query string.
- Tour nổi bật: **8 tour** dạng card, ảnh thumbnail tỉ lệ 600:400, tên, hãng lữ hành, số ngày/đêm, giá từ (VND), CTA xem chi tiết → `tour-detail.html?id=...`. Dữ liệu demo phải có ít nhất 8 tour.
- Hãng hàng không: logo hoặc wordmark của Vietjet Air, Vietnam Airlines, Singapore Airlines và ít nhất 3 hãng khác. Click → `flights.html?airline=...`. Nếu không có quyền dùng logo chính thức, tạo wordmark text / placeholder có nhãn rõ.
- Footer: thông tin liên hệ minh họa, điều khoản demo, bản quyền.

## 4. Chuyến bay (`flights.html`)
- Desktop: panel lọc bên trái, kết quả bên phải. Mobile: bộ lọc dạng offcanvas/drawer.
- Filter: giá **tăng dần/giảm dần** (sort); loại vé Một chiều/Khứ hồi; Bay thẳng; Nhiều thành phố; hãng; khoảng giờ khởi hành; hạng Phổ thông/Thương gia.
- `Nhiều thành phố`: giao diện thêm/xóa ít nhất 2 chặng, mỗi chặng chọn điểm đi, đến, ngày. Với dữ liệu demo, chỉ trả các lộ trình khớp cả chuỗi chặng; nếu không có, cho empty state rõ ràng (không giả vờ có vé).
- Card kết quả: hãng, số hiệu chuyến, điểm đi/đến (IATA và thành phố), ngày/giờ, thời lượng, điểm dừng, mức giá khởi điểm, hạng vé khả dụng, hành lý/điều kiện cơ bản, CTA **Xem chi tiết**.
- Search summary hiện tiêu chí tìm kiếm và nút chỉnh sửa; kết quả cập nhật khi lọc, có số kết quả, xóa bộ lọc, no-results state.

## 5. Chi tiết chuyến bay (`flight-detail.html`)
- Hiện đầy đủ: sân bay đi/đến, ngày/giờ, thời lượng, hãng, số hiệu, loại tàu bay (Airbus/Boeing), chặng dừng nếu có.
- Hai hạng giá: **Phổ thông** và **Thương gia**. Mỗi lựa chọn thể hiện giá, hành lý xách tay/ký gửi, hoàn đổi/điều kiện (demo). Dữ liệu lấy từ `flight_fares`, không hardcode giá trong HTML.
- Chọn hạng, số hành khách (mặc định 1, giới hạn hợp lý), giá tạm tính và thêm vào giỏ. Nếu khứ hồi, thể hiện đây là một chiều của hành trình và hướng dẫn người dùng chọn chặng về; không được mô tả một chặng là vé khứ hồi hoàn chỉnh.

## 6. Tour (`tours.html`)
- Left filter: giá tăng/giảm (sort), hãng hàng không sử dụng trong tour, khoảng giờ cất cánh; có thể thêm điểm đến, số ngày.
- Right list: ảnh 600:400, tên tour, hãng lữ hành, hãng bay, ngày đi, thời lượng bay, số ngày/đêm, giá và dịch vụ bao gồm; link chi tiết.
- Có tối thiểu 8 tours; bộ lọc hoạt động trên dataset, không chỉ là nút trang trí.

## 7. Chi tiết tour (`tour-detail.html`)
- Điểm đi/đến, thời gian/đường bay (nếu bao gồm vé), hãng bay, Airbus/Boeing nếu có thông tin, loại dịch vụ; ghi rõ trường hợp tour không bao gồm chuyến bay.
- Giá tour, số ngày/đêm, ngày khởi hành, dịch vụ gồm/không gồm, lịch trình theo từng ngày (accordion/timeline), chính sách hủy minh họa.
- Chọn ngày và số khách (nếu data hỗ trợ), **Thêm vào giỏ hàng**; lưu ID tour, ngày, số lượng, đơn giá snapshot.

## 8. Giỏ hàng (`cart.html`)
- Liệt kê các chuyến bay và tour đã chọn, mỗi item có mô tả, số lượng/giá, nút xóa, tổng tiền; persist qua reload (`localStorage`). Cho phép xóa từng item và xóa toàn bộ (có xác nhận).
- Form khách: họ tên, email, điện thoại, ghi chú (optional), xác nhận đồng ý xử lý thông tin. Validate email/điện thoại/họ tên, hiển thị lỗi bên cạnh trường.
- Nút **Đăng ký / Xác nhận yêu cầu** → trạng thái hoàn tất và mã tham chiếu demo. Gửi email theo quy tắc trong `06_BOOKING_AND_EMAIL.md`.
- Trước khi xác nhận, phải hiển thị rõ **“Đây là yêu cầu đăng ký demo, chưa phải vé hoặc tour đã được xác nhận”**.

## 9. Ngoài phạm vi
Thanh toán thẻ, tra cứu giá/ghế thời gian thực, đăng nhập, tài khoản khách hàng, quản lý đơn đa thiết bị, gửi mail bảo đảm không qua dịch vụ ngoài, xử lý đặt vé chính thức.
