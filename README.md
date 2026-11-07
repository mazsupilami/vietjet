# VIETJET Travel — Demo & Prototype Website

Website demo tìm kiếm và đăng ký đặt chỗ chuyến bay & tour du lịch với phong cách thương hiệu **Vietjet**, được xây dựng hoàn toàn bằng **HTML5, CSS3, JavaScript thuần (Vanilla JS)** và **SQLite chạy trực tiếp trong trình duyệt qua WebAssembly (sql.js)**.

> ⚠️ **TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM:**  
> Đây là dự án **demo / prototype phục vụ học tập** (AI Vibe Coding), không phải website chính thức của Hãng hàng không Vietjet Air. Giá vé, lịch trình chuyến bay và tour du lịch là dữ liệu mẫu giả lập, không có giá trị thanh toán hoặc xuất vé thực tế.

---

## 📁 Cấu trúc thư mục dự án

```text
Vietjet/
├── index.html                   # Trang chủ: Hero, form tìm kiếm, 6 hãng bay, 8 tour nổi bật
├── flights.html                 # Danh sách chuyến bay: Bộ lọc nâng cao (giá, hãng, giờ bay, cabin, bay thẳng/khứ hồi/multicity)
├── flight-detail.html           # Chi tiết chuyến bay: 2 hạng vé (Economy & Business) và thêm giỏ hàng
├── tours.html                   # Danh sách tour du lịch: Bộ lọc theo giá, hãng bay, thời gian
├── tour-detail.html             # Chi tiết tour: Lịch trình từng ngày, dịch vụ bao gồm, đặt tour
├── cart.html                    # Giỏ hàng & Form nhập thông tin khách hàng (Validation + Consent)
├── confirmation.html            # Trang xác nhận: Mã DEMO-*, tóm tắt đơn, trạng thái Email minh bạch
├── images/                      # Thư mục hình ảnh & logo
│   ├── vietjet-logo.jpg         # Logo nhận diện thương hiệu Vietjet
│   ├── vietjet-hero.jpg         # Ảnh hero tiếp viên & tàu bay Vietjet
│   └── vietjet-plane.jpg        # Ảnh máy bay Vietjet trên bầu trời
├── assets/
│   ├── css/
│   │   └── styles.css           # Bảng màu #ee1d23, responsive 360px - 1440px
│   ├── js/
│   │   ├── config.js            # Cấu hình hệ thống & EmailJS (disabled by default)
│   │   ├── db.js                # Singleton sql.js WASM nạp travel.sqlite
│   │   ├── data-service.js      # Pure selectors truy vấn SQLite
│   │   ├── format.js            # Định dạng VND, ISO ngày giờ, XSS escaping, toast
│   │   ├── navigation.js        # Thanh điều hướng, hamburger mobile, đồng bộ giỏ hàng
│   │   ├── cart.js              # Quản lý giỏ hàng localStorage (vietjet_demo_cart_v1)
│   │   ├── home.js              # Controller trang chủ
│   │   ├── flights.js           # Controller danh sách chuyến bay & bộ lọc
│   │   ├── flight-detail.js     # Controller chi tiết chuyến bay & chọn hạng vé
│   │   ├── tours.js             # Controller danh sách tour
│   │   ├── tour-detail.js       # Controller chi tiết tour & lịch trình
│   │   ├── checkout.js          # Controller giỏ hàng & validate form đăng ký
│   │   └── confirmation.js      # Controller xác nhận tiếp nhận đơn & mailto fallback
│   ├── data/
│   │   └── travel.sqlite        # Tệp cơ sở dữ liệu SQLite binary (136 KB)
│   └── images/
│       ├── fallback-tour.svg    # Ảnh placeholder SVG dự phòng
│       └── airlines/            # Logo SVG các hãng hàng không đối tác
│           ├── vn.svg           # Vietnam Airlines
│           ├── qh.svg           # Bamboo Airways
│           ├── vu.svg           # Vietravel Airlines
│           ├── sq.svg           # Singapore Airlines
│           └── tr.svg           # Scoot
├── sqlite/                      # Thư mục chứa mã nguồn SQL cho SQLite
│   ├── 01_schema.sql            # DDL tạo bảng (airlines, airports, flights, fares, tours, itinerary)
│   ├── 02_seed.sql              # DML seed data (6 hãng, 9 sân bay, 28 chuyến bay, 56 giá vé, 8 tour)
│   ├── init.sql                 # Script gộp khởi tạo toàn bộ database trong 1 lệnh
│   ├── build_db.py              # Script Python biên dịch ra travel.sqlite
│   └── travel.sqlite            # File database SQLite cục bộ
└── README.md
```

---

## 🛠️ Công nghệ & Nguyên lý kỹ thuật

1. **Frontend-only (Không Backend):**
   - Ứng dụng chạy hoàn toàn phía client bằng HTML5, CSS3 và Vanilla JavaScript (ES Modules).
   - Không phụ thuộc Node.js backend, PHP hay framework nặng (React, Vue).

2. **SQLite WebAssembly (`sql.js`):**
   - Trình duyệt nạp tệp `assets/data/travel.sqlite` bằng `fetch` và khởi tạo cơ sở dữ liệu in-memory qua WebAssembly.
   - Toàn bộ truy vấn tìm kiếm, lọc chặng, lọc hãng, sắp xếp giá được thực thi bằng câu lệnh SQL chuẩn (`SELECT ... FROM flights WHERE ...`).

3. **Lưu trữ Giỏ hàng (`localStorage`):**
   - Key: `vietjet_demo_cart_v1`.
   - Giỏ hàng lưu snapshot giá vé, số lượng, ngày khởi hành và đồng bộ tức thì giữa các tab trình duyệt.

4. **Xác nhận & Dịch vụ Email:**
   - Khi hoàn tất, hệ thống sinh mã tham chiếu dạng `DEMO-YYYYMMDD-XXXX`.
   - **Tích hợp EmailJS:** Mặc định ở chế độ `enabled: false` trong `assets/js/config.js`. Không hiển thị trạng thái "đã gửi" giả mạo.
   - **Fallback Mailto:** Tích hợp nút *"Mở ứng dụng Email cá nhân"* với tiêu đề và nội dung được tạo tự động gửi tới `nvhai061993@gmail.com`.

---

## 🚀 Hướng dẫn khởi chạy website

Do trình duyệt chặn truy vấn `fetch` tệp nhị phân (`.sqlite`) qua giao thức `file://`, bạn cần mở dự án thông qua một **Local Static Server**:

### Cách 1: Sử dụng Python (khuyên dùng)
Mở terminal/PowerShell tại thư mục `Vietjet` và chạy:

```bash
python -m http.server 8000
```
Sau đó mở trình duyệt và truy cập: **`http://localhost:8000`**

### Cách 2: Sử dụng VS Code Live Server
- Mở thư mục `Vietjet` trong Visual Studio Code.
- Nhấp chuột phải vào `index.html` và chọn **"Open with Live Server"**.

---

## 🗄️ Thao tác với Cơ sở dữ liệu SQLite

Các file SQL được đặt đầy đủ trong thư mục `sqlite/`:
- Để biên dịch hoặc cập nhật lại database nhị phân, chạy:
  ```bash
  python sqlite/build_db.py
  ```
- File `assets/data/travel.sqlite` sẽ tự động được cập nhật.
