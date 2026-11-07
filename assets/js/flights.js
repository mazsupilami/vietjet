// ============================================================
// VIETJET TRAVEL - FLIGHTS CONTROLLER (flights.html)
// ============================================================

import { searchFlights, getAirlines, getAirports } from './data-service.js';
import { formatVnd, formatTime, formatDuration, formatDate, escapeHtml, showToast } from './format.js';

let currentFilters = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  tripType: 'oneway',
  airline: '',
  stops: null,
  cabin: '',
  timeSlot: '',
  sortBy: 'price_asc',
  legs: [] // Cho multicity
};

document.addEventListener('DOMContentLoaded', async () => {
  parseUrlParams();
  setupFilterEventListeners();
  setupMobileDrawer();
  await loadFilterOptions();
  await executeSearch();
});

/**
 * Đọc query parameters từ URL
 */
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  currentFilters.origin = params.get('from') || '';
  currentFilters.destination = params.get('to') || '';
  currentFilters.departureDate = params.get('departure') || '';
  currentFilters.returnDate = params.get('return') || '';
  currentFilters.tripType = params.get('tripType') || (currentFilters.returnDate ? 'roundtrip' : 'oneway');
  currentFilters.airline = params.get('airline') || '';
  currentFilters.sortBy = params.get('sort') || 'price_asc';
  
  const legsParam = params.get('legs');
  if (legsParam) {
    currentFilters.legs = legsParam.split(',').map(item => {
      const parts = item.split('-');
      return { origin: parts[0], destination: parts[1], departureDate: parts[2] };
    });
    currentFilters.tripType = 'multicity';
  }

  // Đồng bộ giao diện form/sidebar
  const sortSelect = document.getElementById('sort-flights');
  if (sortSelect) sortSelect.value = currentFilters.sortBy;

  // Render thanh Search Summary
  renderSearchSummary();
}

/**
 * Hiển thị tóm tắt tiêu chí tìm kiếm ở đầu trang
 */
function renderSearchSummary() {
  const summaryBox = document.getElementById('search-summary-box');
  if (!summaryBox) return;

  if (currentFilters.tripType === 'multicity') {
    summaryBox.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="font-weight: 800; font-size: 1.15rem; color: var(--primary);">✈ Hành trình Nhiều thành phố (Multi-city)</span>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">Lộ trình gồm ${currentFilters.legs.length > 0 ? currentFilters.legs.length : 2} chặng bay riêng biệt</p>
        </div>
        <button id="btn-edit-search" class="btn-secondary btn-sm">Chỉnh sửa chặng</button>
      </div>
    `;
  } else {
    const routeText = (currentFilters.origin && currentFilters.destination)
      ? `${currentFilters.origin} ➔ ${currentFilters.destination}`
      : 'Tất cả các chặng bay có sẵn';
    const dateText = currentFilters.departureDate
      ? `Ngày đi: ${formatDate(currentFilters.departureDate)}`
      : 'Mọi ngày bay';
    const returnText = (currentFilters.tripType === 'roundtrip' && currentFilters.returnDate)
      ? ` • Ngày về: ${formatDate(currentFilters.returnDate)}`
      : '';
    const typeLabel = currentFilters.tripType === 'roundtrip' ? 'Khứ hồi' : 'Một chiều';

    summaryBox.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 1.25rem; color: var(--text-main);">${escapeHtml(routeText)}</span>
            <span style="background: var(--primary-light); color: var(--primary); font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full);">${typeLabel}</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary);">${escapeHtml(dateText)}${escapeHtml(returnText)}</p>
        </div>
        <button id="btn-toggle-edit-search" class="btn-secondary btn-sm">Thay đổi tìm kiếm</button>
      </div>
    `;
  }

  // Toggle edit panel
  const toggleBtn = document.getElementById('btn-toggle-edit-search') || document.getElementById('btn-edit-search');
  const editPanel = document.getElementById('flight-edit-panel');
  if (toggleBtn && editPanel) {
    toggleBtn.addEventListener('click', () => {
      editPanel.style.display = editPanel.style.display === 'none' ? 'block' : 'none';
    });
  }
}

/**
 * Nạp danh sách options cho bộ lọc và edit panel
 */
async function loadFilterOptions() {
  try {
    const [airlines, airports] = await Promise.all([getAirlines(), getAirports()]);

    // Populate airline filters
    const airlineListContainer = document.getElementById('filter-airlines-list');
    if (airlineListContainer) {
      airlineListContainer.innerHTML = airlines.map(al => `
        <label class="filter-checkbox-item">
          <input type="checkbox" name="filter-airline" value="${al.code}" ${currentFilters.airline === al.code ? 'checked' : ''}>
          <span>${escapeHtml(al.name)} (${al.code})</span>
        </label>
      `).join('');
    }

    // Populate dropdowns in edit panel
    const editOrigin = document.getElementById('edit-origin');
    const editDest = document.getElementById('edit-dest');
    if (editOrigin && editDest) {
      const airportOptions = airports.map(a => `<option value="${a.code}">${a.city} (${a.code})</option>`).join('');
      editOrigin.innerHTML = airportOptions;
      editDest.innerHTML = airportOptions;
      if (currentFilters.origin) editOrigin.value = currentFilters.origin;
      if (currentFilters.destination) editDest.value = currentFilters.destination;
    }
  } catch (e) {
    console.error('Lỗi nạp options lọc:', e);
  }
}

/**
 * Bắt các sự kiện lọc thay đổi
 */
function setupFilterEventListeners() {
  // Sort select
  const sortSelect = document.getElementById('sort-flights');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      executeSearch();
    });
  }

  // Checkbox direct flight only
  const directCheckbox = document.getElementById('filter-direct-only');
  if (directCheckbox) {
    directCheckbox.addEventListener('change', (e) => {
      currentFilters.stops = e.target.checked ? 0 : null;
      executeSearch();
    });
  }

  // Cabin radio
  const cabinRadios = document.querySelectorAll('input[name="filter-cabin"]');
  cabinRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.cabin = e.target.value;
      executeSearch();
    });
  });

  // Time slot radio
  const timeSlotRadios = document.querySelectorAll('input[name="filter-timeslot"]');
  timeSlotRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.timeSlot = e.target.value;
      executeSearch();
    });
  });

  // Airline checkboxes listener
  const airlineContainer = document.getElementById('filter-airlines-list');
  if (airlineContainer) {
    airlineContainer.addEventListener('change', () => {
      const selected = Array.from(document.querySelectorAll('input[name="filter-airline"]:checked')).map(cb => cb.value);
      currentFilters.airline = selected.length === 1 ? selected[0] : '';
      executeSearch();
    });
  }

  // Clear filters
  const clearBtn = document.getElementById('btn-clear-all-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilters.stops = null;
      currentFilters.cabin = '';
      currentFilters.timeSlot = '';
      currentFilters.airline = '';
      currentFilters.sortBy = 'price_asc';

      document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      const sortSelect = document.getElementById('sort-flights');
      if (sortSelect) sortSelect.value = 'price_asc';

      executeSearch();
    });
  }

  // Edit search form submit
  const editForm = document.getElementById('flight-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const origin = document.getElementById('edit-origin')?.value;
      const dest = document.getElementById('edit-dest')?.value;
      const departure = document.getElementById('edit-departure')?.value;
      const tripType = document.getElementById('edit-trip-type')?.value || 'oneway';

      if (origin === dest) {
        showToast('Điểm đi và đến không được trùng nhau', 'warning');
        return;
      }

      currentFilters.origin = origin;
      currentFilters.destination = dest;
      currentFilters.departureDate = departure;
      currentFilters.tripType = tripType;
      
      renderSearchSummary();
      executeSearch();

      const editPanel = document.getElementById('flight-edit-panel');
      if (editPanel) editPanel.style.display = 'none';
    });
  }
}

/**
 * Mobile Filter Drawer
 */
function setupMobileDrawer() {
  const openBtn = document.getElementById('btn-open-mobile-filter');
  const sidebar = document.querySelector('.filter-sidebar');
  const closeBtn = document.getElementById('btn-close-filter-drawer');

  if (openBtn && sidebar) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('open-drawer');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open-drawer');
    });
  }
}

/**
 * Thực thi tìm kiếm và render danh sách kết quả
 */
async function executeSearch() {
  const resultsContainer = document.getElementById('flight-results-container');
  const countBadge = document.getElementById('flight-count-number');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = `<div class="spinner"></div><p style="text-align: center; color: var(--text-muted);">Đang tìm kiếm chuyến bay từ SQLite...</p>`;

  try {
    if (currentFilters.tripType === 'roundtrip' && currentFilters.returnDate) {
      await executeRoundtripSearch(resultsContainer, countBadge);
    } else if (currentFilters.tripType === 'multicity') {
      await executeMulticitySearch(resultsContainer, countBadge);
    } else {
      await executeOnewaySearch(resultsContainer, countBadge);
    }
  } catch (err) {
    console.error('Lỗi khi truy vấn chuyến bay:', err);
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Không thể tải chuyến bay</h3>
        <p>${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}

/**
 * Tìm kiếm một chiều
 */
async function executeOnewaySearch(container, countBadge) {
  const flights = await searchFlights({
    origin: currentFilters.origin,
    destination: currentFilters.destination,
    departureDate: currentFilters.departureDate,
    airline: currentFilters.airline,
    stops: currentFilters.stops,
    cabin: currentFilters.cabin,
    timeSlot: currentFilters.timeSlot,
    sortBy: currentFilters.sortBy
  });

  if (countBadge) countBadge.textContent = flights.length;

  if (flights.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛫</div>
        <h3>Không tìm thấy chuyến bay phù hợp</h3>
        <p>Không có chuyến bay nào khớp với tiêu chuẩn tìm kiếm hoặc ngày đã chọn trong dữ liệu mẫu.</p>
        <p style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">💡 Gợi ý: Hãy thử chọn ngày <strong>2026-12-15</strong> hoặc xóa bộ lọc hãng/giờ bay để xem các chuyến bay có sẵn.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = flights.map(f => renderFlightCard(f)).join('');
}

/**
 * Tìm kiếm khứ hồi (Hiển thị 2 chặng: Chiều Đi và Chiều Về)
 */
async function executeRoundtripSearch(container, countBadge) {
  const outboundFlights = await searchFlights({
    origin: currentFilters.origin,
    destination: currentFilters.destination,
    departureDate: currentFilters.departureDate,
    airline: currentFilters.airline,
    stops: currentFilters.stops,
    cabin: currentFilters.cabin,
    timeSlot: currentFilters.timeSlot,
    sortBy: currentFilters.sortBy
  });

  const inboundFlights = await searchFlights({
    origin: currentFilters.destination,
    destination: currentFilters.origin,
    departureDate: currentFilters.returnDate,
    airline: currentFilters.airline,
    stops: currentFilters.stops,
    cabin: currentFilters.cabin,
    timeSlot: currentFilters.timeSlot,
    sortBy: currentFilters.sortBy
  });

  const totalCount = outboundFlights.length + inboundFlights.length;
  if (countBadge) countBadge.textContent = `${outboundFlights.length} chiều đi, ${inboundFlights.length} chiều về`;

  let html = '';

  // Chặng đi
  html += `
    <div style="margin-bottom: 24px;">
      <div style="background: #ffffff; border-left: 4px solid var(--primary); padding: 12px 18px; border-radius: var(--radius-sm); margin-bottom: 14px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 1.15rem; color: var(--primary);">1. Chiều đi: ${escapeHtml(currentFilters.origin)} ➔ ${escapeHtml(currentFilters.destination)} (${formatDate(currentFilters.departureDate)})</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">Chọn chuyến bay đi để thêm vào giỏ hàng</p>
      </div>
      ${outboundFlights.length > 0 
        ? outboundFlights.map(f => renderFlightCard(f, 'Chiều đi')).join('')
        : '<div class="empty-state"><p>Không có chuyến bay chiều đi phù hợp.</p></div>'
      }
    </div>
  `;

  // Chặng về
  html += `
    <div style="margin-top: 36px;">
      <div style="background: #ffffff; border-left: 4px solid var(--info); padding: 12px 18px; border-radius: var(--radius-sm); margin-bottom: 14px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 1.15rem; color: var(--info);">2. Chiều về: ${escapeHtml(currentFilters.destination)} ➔ ${escapeHtml(currentFilters.origin)} (${formatDate(currentFilters.returnDate)})</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">Chọn chuyến bay về để hoàn tất hành trình khứ hồi</p>
      </div>
      ${inboundFlights.length > 0 
        ? inboundFlights.map(f => renderFlightCard(f, 'Chiều về')).join('')
        : '<div class="empty-state"><p>Không có chuyến bay chiều về phù hợp trên ngày đã chọn.</p></div>'
      }
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Tìm kiếm Nhiều thành phố (Multi-city)
 */
async function executeMulticitySearch(container, countBadge) {
  // Mặc định 2 chặng nếu chưa truyền legs
  const legs = (currentFilters.legs && currentFilters.legs.length > 0)
    ? currentFilters.legs
    : [
        { origin: 'SGN', destination: 'HAN', departureDate: '2026-12-15' },
        { origin: 'HAN', destination: 'DAD', departureDate: '2026-12-18' }
      ];

  let html = `
    <div style="background: #fff; padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 24px;">
      <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Hành trình chuỗi ${legs.length} chặng:</h3>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        ${legs.map((l, idx) => `
          <div style="background: var(--bg-page); padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem;">
            <strong>Chặng ${idx + 1}:</strong> ${escapeHtml(l.origin)} ➔ ${escapeHtml(l.destination)} (${formatDate(l.departureDate)})
          </div>
        `).join('')}
      </div>
    </div>
  `;

  let totalFound = 0;
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const flights = await searchFlights({
      origin: leg.origin,
      destination: leg.destination,
      departureDate: leg.departureDate,
      sortBy: currentFilters.sortBy
    });

    totalFound += flights.length;
    html += `
      <div style="margin-bottom: 32px;">
        <h4 style="font-size: 1.05rem; color: var(--primary); margin-bottom: 12px;">
          Chặng ${i + 1}: ${escapeHtml(leg.origin)} ➔ ${escapeHtml(leg.destination)} (Ngày ${formatDate(leg.departureDate)})
        </h4>
        ${flights.length > 0
          ? flights.map(f => renderFlightCard(f, `Chặng ${i + 1}`)).join('')
          : '<div class="empty-state"><p>Không tìm thấy chuyến bay khớp dữ liệu cho chặng này.</p></div>'
        }
      </div>
    `;
  }

  if (countBadge) countBadge.textContent = `${totalFound} chuyến`;
  container.innerHTML = html;
}

/**
 * Render thẻ hiển thị chuyến bay (Flight Card)
 */
function renderFlightCard(f, tag = '') {
  const stopsText = f.stops === 0 ? 'Bay thẳng' : `${f.stops} điểm dừng`;

  return `
    <article class="flight-card">
      <div class="flight-airline-box">
        <img 
          src="${escapeHtml(f.airline_logo)}" 
          alt="${escapeHtml(f.airline_name)}" 
          class="flight-airline-logo" 
          onerror="this.onerror=null; this.src='assets/images/airlines/vn.svg';"
          loading="lazy"
        />
        <span class="flight-number">${escapeHtml(f.airline_name)} • ${escapeHtml(f.flight_number)}</span>
        <span class="flight-aircraft">✈ ${escapeHtml(f.aircraft_model)}</span>
        ${tag ? `<span style="background: var(--primary-light); color: var(--primary); font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: var(--radius-sm); width: fit-content;">${escapeHtml(tag)}</span>` : ''}
      </div>

      <div class="flight-timeline">
        <div class="flight-time-point">
          <div class="flight-time">${formatTime(f.departure_at)}</div>
          <div class="flight-iata">${escapeHtml(f.origin_code)}</div>
          <div class="flight-city">${escapeHtml(f.origin_city)}</div>
        </div>

        <div class="flight-duration-box">
          <span class="flight-duration-text">${formatDuration(f.duration_minutes)}</span>
          <div class="flight-line"></div>
          <span class="flight-stops-badge">${stopsText}</span>
        </div>

        <div class="flight-time-point">
          <div class="flight-time">${formatTime(f.arrival_at)}</div>
          <div class="flight-iata">${escapeHtml(f.destination_code)}</div>
          <div class="flight-city">${escapeHtml(f.destination_city)}</div>
        </div>
      </div>

      <div class="flight-price-box">
        <div style="text-align: right;">
          <span class="flight-from-price-label">Giá từ</span>
          <div class="flight-price-value">${formatVnd(f.from_price)}</div>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Giá demo / khách</span>
        </div>
        <a href="flight-detail.html?id=${encodeURIComponent(f.id)}" class="btn-primary btn-sm">Xem chi tiết</a>
      </div>
    </article>
  `;
}
