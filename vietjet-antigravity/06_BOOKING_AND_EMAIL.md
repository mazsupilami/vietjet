# Giỏ hàng, Đăng ký và Email — Phạm vi thực tế

## Booking flow (demo)
1. User chọn fare hoặc tour → `addCartItem()` ghi `localStorage`.
2. Trang giỏ hàng hiển thị item theo loại; giá VND có dấu phân tách, tổng tiền, nút xóa từng item, xóa toàn bộ.
3. User nhập **Họ và tên**, **Email**, **Điện thoại**, **Ghi chú** (không bắt buộc), tick đồng ý xử lý thông tin.
4. Validate; hiển thị recap + chú thích: `Đây là yêu cầu đăng ký demo. Chưa xác nhận giữ chỗ hay xuất vé.`
5. Bấm **Đăng ký**; sinh mã `DEMO-*`, tạo trạng thái yêu cầu hoàn tất, thử gửi mail **chỉ khi email service đã được thiết lập**.
6. Điều hướng `confirmation.html`: mã tham chiếu, tóm tắt đơn, trạng thái **Email đã gửi / Không gửi được / Chưa cấu hình email** được xác định từ kết quả thực sự; không hiển thị sai.

## Khả năng gửi email với frontend-only

**Yêu cầu người dùng:** gửi email từ `nvhai061993@gmail.com` đến email khách hàng. Địa chỉ này không thể được frontend tự ý sử dụng làm địa chỉ gửi. Cần quyền truy cập vào tài khoản Google đó, cấu hình **dịch vụ gửi email được ủy quyền**, và xác minh người gửi. Không nhúng Gmail password/App Password vào HTML/JS. Gmail có thể hạn chế alias/sender theo chính sách.

### Phương án A — EmailJS (ưu tiên cho demo)
- Chỉ triển khai nếu người dùng tự thiết lập dịch vụ EmailJS, xác minh tài khoản email gửi được cho phép và template.
- `config.js` chứa placeholders:

```js
export const EMAIL_CONFIG = {
  enabled: false,
  serviceId: 'REPLACE_WITH_EMAILJS_SERVICE_ID',
  templateId: 'REPLACE_WITH_EMAILJS_TEMPLATE_ID',
  publicKey: 'REPLACE_WITH_EMAILJS_PUBLIC_KEY'
};
```

- Dùng EmailJS browser SDK (pin version CDN) để gửi template có `to_email` là email khách, `order_ref`, `customer_name`, `items_summary`, `total_vnd`, `disclaimer`.
- **From** là sender thực sự đã kết nối / được xác minh trong EmailJS; có thể là `nvhai061993@gmail.com` **chỉ nếu tài khoản này do người dùng sở hữu/quản lý và dịch vụ hỗ trợ/đã xác minh**.
- Chỉ set `Email đã gửi` khi Promise resolve success; khi fail hiển thị `Không gửi được` và nút thử lại có giới hạn. Không gửi lặp khi user refresh.
- Cần chống lạm dụng: domain allowlist, quota/rate limits, CAPTCHA nếu service hỗ trợ; frontend public key không phải bí mật.
- EmailJS là dịch vụ bên thứ ba chứ không phải “không có backend trên thế giới”; project **không tự xây dựng backend** nhưng email vẫn chạy qua hạ tầng bên ngoài.

### Phương án B — Không cấu hình dịch vụ email (fallback)
- Chỉ hoàn thành thao tác đăng ký demo trên trình duyệt và hiện nút **“Mở ứng dụng email”** (`mailto:`) với chủ đề/nội dung gợi ý.
- `mailto:` không tự gửi email và thường mở ứng dụng email của người dùng, **không đảm bảo người gửi là** `nvhai061993@gmail.com`; không được đánh dấu `Đã gửi`.

## Example email template (khi A cấu hình thành công)

**Subject:** Vietjet Travel — Xác nhận đã tiếp nhận yêu cầu {{order_ref}}

```text
Xin chào {{customer_name}},

Chúng tôi đã tiếp nhận yêu cầu đăng ký du lịch của bạn.
Mã tham chiếu: {{order_ref}}
Chi tiết: {{items_summary}}
Tổng tiền dự kiến: {{total_vnd}} VND

Lưu ý: Đây là xác nhận tiếp nhận yêu cầu DEMO, chưa phải vé máy bay hoặc tour đã được xác nhận.

Trân trọng,
Vietjet Travel (Website demo)
```

## Bảo vệ dữ liệu
- Không đưa họ tên/email/điện thoại vào URL query params.
- Chỉ gửi PII khi đã được người dùng đồng ý; không sử dụng analytics trackers không khai báo.
- Không lưu hồ sơ đặt vé thật hoặc hứa đảm bảo email đến inbox; cần hệ thống phía máy chủ nếu mở dịch vụ thật.
