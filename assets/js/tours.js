// ============================================================
// VIETJET TRAVEL - TOURS CONTROLLER (tours.html)
// ============================================================

import { getTours, getAirlines } from './data-service.js';
import { formatVnd, escapeHtml } from './format.js';

let tourFilters = {
  airline: '',
  timeSlot: '',
  sortBy: 'price_asc'
};

document.addEventListener('DOMContentLoaded', async () => {
  parseTourUrlParams();
  setupTourFilterListeners();
  setupTourMobileDrawer();
  await loadTourFilterOptions();
  await executeTourSearch();
});

function parseTourUrlParams() {
  const params = new URLSearchParams(window.location.search);
  tourFilters.airline = params.get('airline') || '';
  tourFilters.sortBy = params.get('sort') || 'price_asc';

  const sortSelect = document.getElementById('sort-tours');
  if (sortSelect) sortSelect.value = tourFilters.sortBy;
}

async function loadTourFilterOptions() {
  try {
    const airlines = await getAirlines();
    const container = document.getElementById('tour-filter-airlines');
    if (container) {
      container.innerHTML = airlines.map(al => `
        <label class="filter-checkbox-item">
          <input type="checkbox" name="filter-tour-airline" value="${al.code}" ${tourFilters.airline === al.code ? 'checked' : ''}>
          <span>${escapeHtml(al.name)}</span>
        </label>
      `).join('');
    }
  } catch (e) {
    console.error('Lỗi nạp danh sách hãng cho tour:', e);
  }
}

function setupTourFilterListeners() {
  const sortSelect = document.getElementById('sort-tours');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      tourFilters.sortBy = e.target.value;
      executeTourSearch();
    });
  }

  const airlineContainer = document.getElementById('tour-filter-airlines');
  if (airlineContainer) {
    airlineContainer.addEventListener('change', () => {
      const selected = Array.from(document.querySelectorAll('input[name="filter-tour-airline"]:checked')).map(cb => cb.value);
      tourFilters.airline = selected.length === 1 ? selected[0] : '';
      executeTourSearch();
    });
  }

  const timeSlotRadios = document.querySelectorAll('input[name="filter-tour-timeslot"]');
  timeSlotRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      tourFilters.timeSlot = e.target.value;
      executeTourSearch();
    });
  });

  const clearBtn = document.getElementById('btn-clear-tour-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      tourFilters.airline = '';
      tourFilters.timeSlot = '';
      tourFilters.sortBy = 'price_asc';

      document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      if (sortSelect) sortSelect.value = 'price_asc';

      executeTourSearch();
    });
  }
}

function setupTourMobileDrawer() {
  const openBtn = document.getElementById('btn-open-tour-filter');
  const sidebar = document.querySelector('.filter-sidebar');
  const closeBtn = document.getElementById('btn-close-tour-drawer');

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

async function executeTourSearch() {
  const container = document.getElementById('tour-results-grid');
  const countBadge = document.getElementById('tour-count-number');
  if (!container) return;

  container.innerHTML = `<div class="spinner" style="grid-column: 1 / -1;"></div>`;

  try {
    const tours = await getTours({
      airline: tourFilters.airline,
      timeSlot: tourFilters.timeSlot,
      sortBy: tourFilters.sortBy
    });

    if (countBadge) countBadge.textContent = tours.length;

    if (tours.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🏖️</div>
          <h3>Không tìm thấy tour phù hợp</h3>
          <p>Hãy thử xóa bớt các tiêu chí lọc hãng hàng không hoặc khung giờ để tìm kiếm tour du lịch.</p>
        </div>
      `;
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
          ${tour.airline_name ? `<span class="tour-airline-tag">${escapeHtml(tour.airline_name)}</span>` : '<span class="tour-airline-tag">Xe du lịch</span>'}
        </div>
        <div class="tour-body">
          <div class="tour-agency">${escapeHtml(tour.agency_name)}</div>
          <h3 class="tour-title" title="${escapeHtml(tour.title)}">${escapeHtml(tour.title)}</h3>
          <div class="tour-meta">
            <span>📅 ${escapeHtml(tour.days)} ngày ${escapeHtml(tour.nights)} đêm</span>
            ${tour.flight_duration_minutes ? `<span>⏱ Bay ${tour.flight_duration_minutes}p</span>` : ''}
          </div>
          <div class="tour-footer">
            <div class="tour-price-box">
              <span class="tour-price-label">Giá trọn gói từ</span>
              <span class="tour-price-vnd">${formatVnd(tour.price_vnd)}</span>
            </div>
            <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="btn-primary btn-sm">Xem chi tiết</a>
          </div>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error('Lỗi tải tour:', err);
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>Lỗi tải dữ liệu</h3>
        <p>${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}
