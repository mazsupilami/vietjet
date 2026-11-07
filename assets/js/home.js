// ============================================================
// VIETJET TRAVEL - HOMEPAGE CONTROLLER (index.html)
// ============================================================

import { getAirports, getAirlines, getTours } from './data-service.js';
import { formatVnd, escapeHtml, showToast } from './format.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initFlightSearchForm();
    await loadAirlineBadges();
    await loadFeaturedTours();
  } catch (err) {
    console.error('Lỗi khởi tạo trang chủ:', err);
  }
});

/**
 * Khởi tạo form tìm kiếm chuyến bay với validation chuẩn PRD
 */
async function initFlightSearchForm() {
  const originSelect = document.getElementById('search-origin');
  const destSelect = document.getElementById('search-dest');
  const departureInput = document.getElementById('search-departure');
  const returnInput = document.getElementById('search-return');
  const returnGroup = document.getElementById('return-date-group');
  const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
  const searchForm = document.getElementById('flight-search-form');
  const swapBtn = document.getElementById('btn-swap-airports');

  // Điền danh sách sân bay
  try {
    const airports = await getAirports();
    if (originSelect && destSelect) {
      originSelect.innerHTML = airports.map(a => `<option value="${a.code}">${a.city} (${a.code}) - ${a.name}</option>`).join('');
      destSelect.innerHTML = airports.map(a => `<option value="${a.code}">${a.city} (${a.code}) - ${a.name}</option>`).join('');

      // Giá trị mặc định
      originSelect.value = 'SGN';
      destSelect.value = 'HAN';
    }
  } catch (e) {
    console.warn('Chưa nạp được danh sách sân bay từ DB:', e);
  }

  // Thiết lập ngày mặc định (2026-12-15 theo kịch bản demo)
  const defaultDepDate = '2026-12-15';
  const defaultRetDate = '2026-12-20';
  if (departureInput) {
    departureInput.value = defaultDepDate;
    // Tối thiểu là ngày hôm nay nếu chạy thực tế
    const todayStr = new Date().toISOString().split('T')[0];
    departureInput.min = todayStr;
  }
  if (returnInput) {
    returnInput.value = defaultRetDate;
    returnInput.min = defaultDepDate;
  }

  // Đổi chiều ngày đi / ngày về khi chọn
  if (departureInput && returnInput) {
    departureInput.addEventListener('change', () => {
      returnInput.min = departureInput.value;
      if (returnInput.value && returnInput.value < departureInput.value) {
        returnInput.value = departureInput.value;
      }
    });
  }

  // Nút hoán đổi sân bay
  if (swapBtn && originSelect && destSelect) {
    swapBtn.addEventListener('click', () => {
      const temp = originSelect.value;
      originSelect.value = destSelect.value;
      destSelect.value = temp;
    });
  }

  // Xử lý chuyển đổi loại hành trình (Một chiều / Khứ hồi / Nhiều thành phố)
  tripTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = e.target.value;
      document.querySelectorAll('.radio-pill').forEach(p => p.classList.remove('checked'));
      e.target.closest('.radio-pill').classList.add('checked');

      if (type === 'roundtrip') {
        if (returnGroup) returnGroup.style.display = 'flex';
      } else if (type === 'oneway') {
        if (returnGroup) returnGroup.style.display = 'none';
      } else if (type === 'multicity') {
        // Chuyển hướng tới trang flights kèm param multicity
        window.location.href = 'flights.html?tripType=multicity';
      }
    });
  });

  // Submit form
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const origin = originSelect.value;
      const destination = destSelect.value;
      const departure = departureInput.value;
      const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'oneway';

      // Validation
      if (origin === destination) {
        showToast('Điểm đi và điểm đến không được trùng nhau!', 'warning');
        return;
      }
      if (!departure) {
        showToast('Vui lòng chọn ngày khởi hành!', 'warning');
        return;
      }

      let query = `flights.html?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&departure=${encodeURIComponent(departure)}&tripType=${encodeURIComponent(tripType)}`;

      if (tripType === 'roundtrip') {
        const returnDate = returnInput.value;
        if (!returnDate) {
          showToast('Vui lòng chọn ngày về cho hành trình khứ hồi!', 'warning');
          return;
        }
        if (returnDate < departure) {
          showToast('Ngày về không thể trước ngày đi!', 'warning');
          return;
        }
        query += `&return=${encodeURIComponent(returnDate)}`;
      }

      window.location.href = query;
    });
  }
}

/**
 * Nạp danh sách logo/wordmark các hãng hàng không
 */
async function loadAirlineBadges() {
  const container = document.getElementById('airlines-grid');
  if (!container) return;

  try {
    const airlines = await getAirlines();
    container.innerHTML = airlines.map(al => `
      <a href="flights.html?airline=${encodeURIComponent(al.code)}" class="airline-badge-card" title="Xem chuyến bay của ${escapeHtml(al.name)}">
        <img 
          src="${escapeHtml(al.logo_url)}" 
          alt="Hãng ${escapeHtml(al.name)}" 
          class="airline-badge-logo" 
          onerror="this.onerror=null; this.src='assets/images/airlines/vn.svg';"
          loading="lazy"
        />
        <span class="airline-badge-name">${escapeHtml(al.name)}</span>
      </a>
    `).join('');
  } catch (e) {
    console.error('Lỗi nạp hãng hàng không:', e);
    container.innerHTML = `<p class="empty-state">Đang tải danh sách hãng hàng không...</p>`;
  }
}

/**
 * Nạp 8 tour nổi bật lên trang chủ
 */
async function loadFeaturedTours() {
  const container = document.getElementById('featured-tours-grid');
  if (!container) return;

  try {
    const tours = await getTours({ featuredOnly: true });
    if (!tours || tours.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Chưa có dữ liệu tour mẫu.</p></div>`;
      return;
    }

    container.innerHTML = tours.map(tour => `
      <article class="tour-card">
        <div class="tour-thumb-wrap">
          <img 
            src="${escapeHtml(tour.image_url)}" 
            alt="${escapeHtml(tour.title)}" 
            class="tour-thumb" 
            width="600" 
            height="400" 
            loading="lazy"
            onerror="this.onerror=null; this.src='assets/images/fallback-tour.svg';"
          />
          <span class="tour-duration-badge">${tour.days}N${tour.nights}Đ</span>
          ${tour.airline_name ? `<span class="tour-airline-tag">${escapeHtml(tour.airline_name)}</span>` : ''}
        </div>
        <div class="tour-body">
          <div class="tour-agency">${escapeHtml(tour.agency_name)}</div>
          <h3 class="tour-title" title="${escapeHtml(tour.title)}">${escapeHtml(tour.title)}</h3>
          <div class="tour-meta">
            <span>📅 ${escapeHtml(tour.days)} ngày ${escapeHtml(tour.nights)} đêm</span>
          </div>
          <div class="tour-footer">
            <div class="tour-price-box">
              <span class="tour-price-label">Giá từ</span>
              <span class="tour-price-vnd">${formatVnd(tour.price_vnd)}</span>
            </div>
            <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="btn-primary btn-sm">Xem chi tiết</a>
          </div>
        </div>
      </article>
    `).join('');
  } catch (e) {
    console.error('Lỗi nạp tour:', e);
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>Không thể nạp dữ liệu tour từ SQLite. Vui lòng kiểm tra kết nối WebAssembly hoặc chạy trên local HTTP server.</p>
      </div>
    `;
  }
}
