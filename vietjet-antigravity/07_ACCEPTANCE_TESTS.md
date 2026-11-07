# Acceptance Tests — Checklist nghiệm thu

## A. Giao diện
- [ ] Primary `#ee1d23`; nền chủ đạo trắng/sáng; chữ dễ đọc.
- [ ] Không tràn ngang trên viewport 360px, 768px, 1440px.
- [ ] Navbar/menu hoạt động mọi trang; cart badge cập nhật ngay.
- [ ] Mọi ảnh có `alt`, lazy-load hình dưới fold; 8 tour thumbnail đúng tỷ lệ 600:400 và fallback nếu ảnh lỗi.
- [ ] Airline logos/wordmarks click dẫn đến danh sách chuyến bay đã lọc hãng.

## B. Home & search
- [ ] Form một chiều hợp lệ → `flights.html` với URL params đúng.
- [ ] Chọn khứ hồi hiện ngày về; ngày về không nhỏ hơn ngày đi.
- [ ] Không cho trùng nơi đi/nơi đến hoặc ngày trong quá khứ.
- [ ] Có đúng/tối thiểu 8 tour nổi bật; card link đến đúng `tour-detail.html?id=...`.

## C. Flights
- [ ] Filter giá tăng và giảm thay đổi thứ tự thực tế.
- [ ] Filter hãng, thời gian, cabin, direct flight hoạt động và kết hợp được.
- [ ] Một chiều / khứ hồi / nhiều thành phố hoạt động đúng hoặc thể hiện rõ thiếu dữ liệu mẫu.
- [ ] Bấm xem chi tiết giữ đúng chuyến đã chọn.
- [ ] Unknown ID hiện 404-friendly state.

## D. Flight details
- [ ] Thấy thông tin giờ bay, sân bay, số hiệu, hãng, loại tàu bay.
- [ ] Economy và Business chọn được, giá/điều kiện thay đổi đúng data fare.
- [ ] Thêm 1 vé vào giỏ được, reload vẫn còn; duplicate line item được gộp nếu cùng flight/fare.

## E. Tours
- [ ] Tour list có hãng lữ hành, hãng bay nếu có, thời gian khởi hành, giá, dịch vụ.
- [ ] Sort giá / filter airline / filter giờ hoạt động.
- [ ] Detail có lịch trình theo ngày, gồm/không gồm, chính sách và CTA.
- [ ] Thêm tour vào giỏ, giữ ngày khởi hành và số lượng.

## F. Cart & registration
- [ ] Hiển thị đồng thời flight + tour, tổng tiền đúng bằng tổng `quantity × unitPriceVnd`.
- [ ] Xóa một item/xóa toàn bộ cập nhật tổng; cart trống có CTA quay lại.
- [ ] Form validate họ tên, email, điện thoại, consent; không submit khi dữ liệu sai.
- [ ] Confirmation hiện mã demo và lưu ý chưa xác nhận đặt vé thật.
- [ ] Không nhúng mật khẩu/key bí mật, không lưu PII trong localStorage.

## G. Email
- [ ] `enabled=false`: không gọi provider, không giả vờ email đã gửi; có mailto fallback.
- [ ] `enabled=true` với cấu hình hợp lệ: chỉ báo đã gửi sau khi provider thành công.
- [ ] Provider lỗi/timeout: hiển thị trạng thái chưa gửi, cho thử lại; không hứa giao thành công.
- [ ] Sender `nvhai061993@gmail.com` chỉ sử dụng khi được quyền và đã xác minh/cấu hình trên provider.

## H. Runtime
- [ ] Chạy trên static localhost HTTP(S) với `travel.sqlite`/WASM, không backend nghiệp vụ.
- [ ] Không phát sinh JS uncaught error trong console luồng chính.
- [ ] Tải DB lỗi hiện thông báo + retry.
- [ ] Chỉ seed giá/dữ liệu demo, có nhãn không phải giá thật.

## Definition of Done
Không chấp nhận skeleton rỗng, CTA không hoạt động, static mocked UI không đọc SQLite, hay trạng thái email success giả. Agent tự kiểm tra click-through và sửa lỗi trước khi báo hoàn thành.
