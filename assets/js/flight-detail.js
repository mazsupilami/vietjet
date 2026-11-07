// ============================================================
// VIETJET TRAVEL - FLIGHT DETAIL CONTROLLER (flight-detail.html)
// ============================================================

import { getFlightById, getFlightFares } from './data-service.js';
import { addFlightToCart } from './cart.js';
import { formatVnd, formatTime, formatDateFull, formatDuration, escapeHtml, showToast } from './format.js';

let currentFlight = null;
let currentFares = [];
let selectedFare = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const flightId = params.get('id');

  if (!flightId) {
    showError('Không tìm thấy mã chuyến bay trong yêu cầu.');
    return;
  }

  await loadFlightDetail(flightId);
});

/**
 * Tải dữ liệu chuyến bay và danh sách hạng vé từ SQLite
 */
async function loadFlightDetail(flightId) {
  const container = document.getElementById('flight-detail-container');
  if (!container) return;

  try {
    const [flight, fares] = await Promise.all([
      getFlightById(flightId),
      getFlightFares(flightId)
    ]);

    if (!flight) {
      showError(`Chuyến bay với mã "${escapeHtml(flightId)}" không tồn tại.`);
      return;
    }

    currentFlight = flight;
    currentFares = fares;
    selectedFare = fares[0] || null; // Mặc định chọn hạng đầu tiên

    renderFlightDetail(flight, fares);
  } catch (err) {
    console.error('Lỗi khi tải chi tiết chuyến bay:', err);
    showError('Lỗi kết nối cơ sở dữ liệu: ' + err.message);
  }
}

/**
 * Hiển thị giao diện chi tiết chuyến bay
 */
function renderFlightDetail(flight, fares) {
  const container = document.getElementById('flight-detail-container');
  if (!container) return;

  const stopsText = flight.stops === 0 ? 'Bay thẳng' : `${flight.stops} điểm dừng`;

  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav">
      <a href="index.html">Trang chủ</a> <span>/</span>
      <a href="flights.html">Chuyến bay</a> <span>/</span>
      <span style="color: var(--text-main); font-weight: 600;">${escapeHtml(flight.airline_name)} ${escapeHtml(flight.flight_number)}</span>
    </nav>

    <!-- Header Card -->
    <div class="detail-header-card">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid var(--border-light);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img 
            src="${escapeHtml(flight.airline_logo)}" 
            alt="${escapeHtml(flight.airline_name)}" 
            style="height: 44px; object-fit: contain;" 
            onerror="this.onerror=null; this.src='assets/images/airlines/vn.svg';"
          />
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">${escapeHtml(flight.airline_name)} • ${escapeHtml(flight.flight_number)}</h1>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Tàu bay: <strong>${escapeHtml(flight.aircraft_model)}</strong> • Trạng thái: <span style="color: var(--success); font-weight: 700;">Khả dụng</span></p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="background: var(--primary-light); color: var(--primary); font-size: 0.82rem; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full);">${stopsText}</span>
        </div>
      </div>

      <!-- Schedule Route Display -->
      <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px; background: var(--bg-page); padding: 24px; border-radius: var(--radius-md); margin-bottom: 24px;">
        <div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Khởi hành • ${formatDateFull(flight.departure_at)}</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">${formatTime(flight.departure_at)}</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">${escapeHtml(flight.origin_city)} (${escapeHtml(flight.origin_code)})</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(flight.origin_airport_name)}</div>
        </div>

        <div style="text-align: center; padding: 0 16px;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">${formatDuration(flight.duration_minutes)}</span>
          <div style="width: 120px; height: 2px; background: var(--primary); margin: 6px auto; position: relative;">
            <span style="position: absolute; right: 0; top: -4px; width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 6px solid var(--primary);"></span>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${stopsText}</span>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Đến nơi • ${formatDateFull(flight.arrival_at)}</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin: 4px 0;">${formatTime(flight.arrival_at)}</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">${escapeHtml(flight.destination_city)} (${escapeHtml(flight.destination_code)})</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(flight.destination_airport_name)}</div>
        </div>
      </div>

      <!-- Baggage Notes -->
      <div style="display: flex; gap: 24px; font-size: 0.88rem; color: var(--text-secondary); flex-wrap: wrap;">
        <div>🧳 <strong>Hành lý xách tay:</strong> ${escapeHtml(flight.cabin_baggage_note || '7kg tiêu chuẩn')}</div>
        <div>📦 <strong>Hành lý ký gửi:</strong> ${escapeHtml(flight.checked_baggage_note || 'Tùy theo hạng vé lựa chọn')}</div>
      </div>
    </div>

    <!-- Fare Selection Section -->
    <div style="margin-top: 36px;">
      <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 8px;">Lựa chọn hạng vé</h2>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 18px;">Chọn gói giá vé phù hợp với nhu cầu hành lý và tính linh hoạt của bạn:</p>

      <div class="fare-options-grid" id="fare-cards-container">
        ${fares.map((fare, idx) => `
          <div 
            class="fare-card ${idx === 0 ? 'selected' : ''}" 
            data-fare-id="${escapeHtml(fare.id)}"
            role="radio"
            tabindex="0"
            aria-checked="${idx === 0 ? 'true' : 'false'}"
          >
            <div class="fare-header">
              <div>
                <span style="background: ${fare.cabin === 'business' ? '#f59e0b' : '#3b82f6'}; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-sm); text-transform: uppercase;">
                  ${fare.cabin === 'business' ? 'Thương gia' : 'Phổ thông'}
                </span>
                <div class="fare-title" style="margin-top: 6px;">
                  ${fare.cabin === 'business' ? 'Hạng SkyBoss / Business' : 'Hạng Eco / Economy'}
                </div>
              </div>
              <div class="fare-price">${formatVnd(fare.price_vnd)}</div>
            </div>

            <ul class="fare-features">
              <li class="fare-feature-item">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Hành lý xách tay: <strong>${fare.carry_on_kg}kg</strong></span>
              </li>
              <li class="fare-feature-item">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Hành lý ký gửi: <strong>${fare.checked_baggage_kg > 0 ? fare.checked_baggage_kg + 'kg' : 'Không bao gồm (mua thêm)'}</strong></span>
              </li>
              <li class="fare-feature-item">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Đổi vé: ${escapeHtml(fare.change_policy)}</span>
              </li>
              <li class="fare-feature-item">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Hoàn vé: ${escapeHtml(fare.refund_policy)}</span>
              </li>
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- Quantity & Add to Cart Action -->
      <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; margin-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <label for="passenger-quantity" style="font-weight: 700; font-size: 0.95rem;">Số hành khách:</label>
          <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
            <button id="btn-qty-minus" style="padding: 8px 16px; background: var(--bg-page); font-weight: 700; font-size: 1.1rem;">-</button>
            <input type="number" id="passenger-quantity" value="1" min="1" max="9" style="width: 50px; text-align: center; border: none; font-weight: 700; font-size: 1rem;" readonly />
            <button id="btn-qty-plus" style="padding: 8px 16px; background: var(--bg-page); font-weight: 700; font-size: 1.1rem;">+</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 24px;">
          <div style="text-align: right;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">Tạm tính:</span>
            <div id="flight-subtotal-price" style="font-size: 1.6rem; font-weight: 800; color: var(--primary);">
              ${selectedFare ? formatVnd(selectedFare.price_vnd) : '0 ₫'}
            </div>
          </div>
          <button id="btn-add-flight-cart" class="btn-primary" style="height: 52px; padding: 0 32px; font-size: 1.05rem;">
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  `;

  // Gắn sự kiện chọn hạng vé
  setupFareCardSelection();
  setupQuantityControls();
}

/**
 * Xử lý click chọn hạng vé
 */
function setupFareCardSelection() {
  const cards = document.querySelectorAll('.fare-card');
  cards.forEach(card => {
    const selectThisFare = () => {
      cards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');

      const fareId = card.getAttribute('data-fare-id');
      selectedFare = currentFares.find(f => f.id === fareId) || currentFares[0];
      updateSubtotal();
    };

    card.addEventListener('click', selectThisFare);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectThisFare();
      }
    });
  });
}

/**
 * Xử lý tăng giảm số lượng hành khách
 */
function setupQuantityControls() {
  const minusBtn = document.getElementById('btn-qty-minus');
  const plusBtn = document.getElementById('btn-qty-plus');
  const qtyInput = document.getElementById('passenger-quantity');
  const addCartBtn = document.getElementById('btn-add-flight-cart');

  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyInput.value = quantity;
        updateSubtotal();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (quantity < 9) {
        quantity++;
        qtyInput.value = quantity;
        updateSubtotal();
      }
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      if (!currentFlight || !selectedFare) {
        showToast('Vui lòng chọn hạng vé trước khi thêm vào giỏ!', 'warning');
        return;
      }

      addFlightToCart(currentFlight, selectedFare, quantity);
      showToast(`Đã thêm ${quantity} vé chuyến bay ${currentFlight.flight_number} vào giỏ hàng!`, 'success');
      
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 700);
    });
  }
}

/**
 * Cập nhật số tiền tạm tính
 */
function updateSubtotal() {
  const subtotalEl = document.getElementById('flight-subtotal-price');
  if (subtotalEl && selectedFare) {
    const total = selectedFare.price_vnd * quantity;
    subtotalEl.textContent = formatVnd(total);
  }
}

function showError(message) {
  const container = document.getElementById('flight-detail-container');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state" style="margin-top: 40px;">
      <div class="empty-state-icon">⚠️</div>
      <h2>Chuyến bay không tìm thấy</h2>
      <p style="margin: 12px 0 24px 0;">${escapeHtml(message)}</p>
      <a href="flights.html" class="btn-primary">Quay lại danh sách chuyến bay</a>
    </div>
  `;
}
