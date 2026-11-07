// ============================================================
// VIETJET TRAVEL - TOUR DETAIL CONTROLLER (tour-detail.html)
// ============================================================

import { getTourById, getTourItinerary } from './data-service.js';
import { addTourToCart } from './cart.js';
import { formatVnd, formatDate, escapeHtml, showToast } from './format.js';

let currentTour = null;
let currentItinerary = [];
let guestQuantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const tourId = params.get('id');

  if (!tourId) {
    showTourError('Không tìm thấy mã tour trong yêu cầu.');
    return;
  }

  await loadTourDetail(tourId);
});

async function loadTourDetail(tourId) {
  const container = document.getElementById('tour-detail-container');
  if (!container) return;

  try {
    const [tour, itinerary] = await Promise.all([
      getTourById(tourId),
      getTourItinerary(tourId)
    ]);

    if (!tour) {
      showTourError(`Tour du lịch với mã "${escapeHtml(tourId)}" không tồn tại.`);
      return;
    }

    currentTour = tour;
    currentItinerary = itinerary;
    renderTourDetail(tour, itinerary);
  } catch (err) {
    console.error('Lỗi khi tải chi tiết tour:', err);
    showTourError('Lỗi kết nối cơ sở dữ liệu: ' + err.message);
  }
}

function renderTourDetail(tour, itinerary) {
  const container = document.getElementById('tour-detail-container');
  if (!container) return;

  const defaultDepDate = tour.departure_at ? tour.departure_at.split('T')[0] : '2026-12-15';

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav">
      <a href="index.html">Trang chủ</a> <span>/</span>
      <a href="tours.html">Tour du lịch</a> <span>/</span>
      <span style="color: var(--text-main); font-weight: 600;">${escapeHtml(tour.title)}</span>
    </nav>

    <!-- Header Section -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span style="background: var(--primary-light); color: var(--primary); font-size: 0.8rem; font-weight: 700; padding: 3px 10px; border-radius: var(--radius-sm); text-transform: uppercase;">
          ${escapeHtml(tour.agency_name)}
        </span>
        <span style="font-size: 0.85rem; color: var(--text-secondary);">Mã tour: <strong>${escapeHtml(tour.id)}</strong></span>
      </div>
      <h1 style="font-size: 1.85rem; font-weight: 800; line-height: 1.3; color: var(--text-main);">${escapeHtml(tour.title)}</h1>
    </div>

    <!-- Main 2 Columns Layout -->
    <div style="display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start;">
      
      <!-- Left Column: Image, Info, Services, Itinerary -->
      <div>
        <div style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); margin-bottom: 32px;">
          <img 
            src="${escapeHtml(tour.image_url)}" 
            alt="${escapeHtml(tour.title)}" 
            style="width: 100%; height: 420px; object-fit: cover;"
            onerror="this.onerror=null; this.src='assets/images/fallback-tour.svg';"
          />
        </div>

        <!-- Highlight Meta Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; margin-bottom: 32px;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Thời gian</span>
            <strong style="font-size: 1.05rem; color: var(--text-main);">📅 ${tour.days} ngày ${tour.nights} đêm</strong>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Hãng bay</span>
            <strong style="font-size: 1.05rem; color: var(--text-main);">✈ ${escapeHtml(tour.airline_name || 'Xe du lịch chất lượng cao')}</strong>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Khởi hành từ</span>
            <strong style="font-size: 1.05rem; color: var(--text-main);">📍 ${escapeHtml(tour.origin_city || 'TP. Hồ Chí Minh')}</strong>
          </div>
        </div>

        <!-- Services Section -->
        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; margin-bottom: 32px;">
          <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 18px;">Dịch vụ tour</h2>
          
          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.95rem; color: var(--success); margin-bottom: 8px; font-weight: 700;">✓ Dịch vụ bao gồm:</h4>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(tour.included_services || 'Vé máy bay, khách sạn, xe tham quan và ăn uống theo chương trình')}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.95rem; color: var(--danger); margin-bottom: 8px; font-weight: 700;">✗ Dịch vụ không bao gồm:</h4>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(tour.excluded_services || 'Chi phí cá nhân, đồ uống, thuế VAT, tiền tip')}</p>
          </div>

          <div>
            <h4 style="font-size: 0.95rem; color: var(--warning); margin-bottom: 8px; font-weight: 700;">ℹ Chính sách hủy phạt demo:</h4>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(tour.cancellation_policy || 'Hủy trước 15 ngày miễn phí. Xem chi tiết tại hợp đồng.')}</p>
          </div>
        </div>

        <!-- Itinerary Timeline -->
        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px;">
          <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 18px;">Lịch trình chi tiết từng ngày</h2>
          <div class="itinerary-timeline">
            ${itinerary.map(item => `
              <div class="itinerary-day-card">
                <div class="itinerary-day-title">
                  <span style="background: var(--primary); color: #fff; font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-sm);">Ngày ${item.day_number}</span>
                  <span>${escapeHtml(item.title)}</span>
                </div>
                <div class="itinerary-day-desc">${escapeHtml(item.description)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Booking Box (Sticky) -->
      <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); position: sticky; top: 96px;">
        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Giá tour trọn gói / khách</span>
        <div style="font-size: 2rem; font-weight: 800; color: var(--primary); margin: 6px 0 16px 0;">${formatVnd(tour.price_vnd)}</div>

        <form id="tour-booking-form">
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label" for="tour-dep-date">Ngày khởi hành:</label>
            <input type="date" id="tour-dep-date" class="form-control" value="${defaultDepDate}" min="${new Date().toISOString().split('T')[0]}" required />
          </div>

          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label">Số lượng khách:</label>
            <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
              <button type="button" id="tour-qty-minus" style="padding: 10px 18px; background: var(--bg-page); font-weight: 700; font-size: 1.1rem;">-</button>
              <input type="number" id="tour-quantity" value="1" min="1" max="20" style="width: 100%; text-align: center; border: none; font-weight: 700; font-size: 1rem;" readonly />
              <button type="button" id="tour-qty-plus" style="padding: 10px 18px; background: var(--bg-page); font-weight: 700; font-size: 1.1rem;">+</button>
            </div>
          </div>

          <div style="border-top: 1px dashed var(--border-color); padding-top: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700;">Tổng tiền:</span>
            <span id="tour-subtotal-price" style="font-size: 1.45rem; font-weight: 800; color: var(--primary);">${formatVnd(tour.price_vnd)}</span>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; height: 50px; font-size: 1.05rem;">
            🛒 Đặt tour / Thêm vào giỏ
          </button>
        </form>

        <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 14px;">
          Lưu ý: Dữ liệu đặt tour demo, không trừ tiền thẻ hoặc giữ chỗ thực tế.
        </p>
      </div>

    </div>
  `;

  setupTourBookingControls(tour);
}

function setupTourBookingControls(tour) {
  const minusBtn = document.getElementById('tour-qty-minus');
  const plusBtn = document.getElementById('tour-qty-plus');
  const qtyInput = document.getElementById('tour-quantity');
  const subtotalEl = document.getElementById('tour-subtotal-price');
  const form = document.getElementById('tour-booking-form');

  const updateTourSubtotal = () => {
    subtotalEl.textContent = formatVnd(tour.price_vnd * guestQuantity);
  };

  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
      if (guestQuantity > 1) {
        guestQuantity--;
        qtyInput.value = guestQuantity;
        updateTourSubtotal();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (guestQuantity < 20) {
        guestQuantity++;
        qtyInput.value = guestQuantity;
        updateTourSubtotal();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const depDate = document.getElementById('tour-dep-date')?.value || tour.departure_at;

      addTourToCart(tour, guestQuantity, depDate);
      showToast(`Đã thêm ${guestQuantity} vé Tour ${tour.title} vào giỏ hàng!`, 'success');

      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 700);
    });
  }
}

function showTourError(message) {
  const container = document.getElementById('tour-detail-container');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state" style="margin-top: 40px;">
      <div class="empty-state-icon">🏖️</div>
      <h2>Tour không tìm thấy</h2>
      <p style="margin: 12px 0 24px 0;">${escapeHtml(message)}</p>
      <a href="tours.html" class="btn-primary">Quay lại danh sách tour</a>
    </div>
  `;
}
