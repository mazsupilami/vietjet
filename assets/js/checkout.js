// ============================================================
// VIETJET TRAVEL - CART & CHECKOUT CONTROLLER (cart.html)
// ============================================================

import { getCart, removeCartItem, clearCart, getCartTotal } from './cart.js';
import { formatVnd, formatDate, escapeHtml, showToast } from './format.js';
import { EMAIL_CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  renderCartView();
  setupCheckoutForm();
});

/**
 * Hiển thị giao diện giỏ hàng
 */
function renderCartView() {
  const container = document.getElementById('cart-items-container');
  const summaryBox = document.getElementById('checkout-sidebar-summary');
  const cartLayout = document.getElementById('cart-main-layout');
  const emptyState = document.getElementById('cart-empty-state');

  if (!container) return;

  const cart = getCart();

  if (!cart.items || cart.items.length === 0) {
    if (cartLayout) cartLayout.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (cartLayout) cartLayout.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  // Render danh sách sản phẩm
  container.innerHTML = cart.items.map((item, index) => {
    const isFlight = item.type === 'flight';
    const subtotal = (Number(item.quantity) || 1) * (Number(item.unitPriceVnd) || 0);

    return `
      <div class="cart-item-card">
        <div style="display: flex; gap: 16px; align-items: center; flex: 1;">
          <div style="font-size: 1.8rem; background: var(--bg-page); width: 56px; height: 56px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${isFlight ? '✈️' : '🏖️'}
          </div>
          <div class="cart-item-info">
            <h4>${escapeHtml(item.title)}</h4>
            <div class="cart-item-meta">
              ${isFlight 
                ? `<span>${escapeHtml(item.route)} • Khởi hành: ${formatDate(item.departureAt)} • Hạng: <strong>${item.cabin === 'business' ? 'Thương gia' : 'Phổ thông'}</strong></span>`
                : `<span>${escapeHtml(item.duration)} • Khởi hành: ${formatDate(item.departureAt)}</span>`
              }
            </div>
            <div style="margin-top: 6px; font-size: 0.85rem; color: var(--text-muted);">
              Đơn giá: <strong>${formatVnd(item.unitPriceVnd)}</strong> × Số lượng: <strong>${item.quantity}</strong>
            </div>
          </div>
        </div>

        <div class="cart-item-price-actions">
          <div class="cart-item-price">${formatVnd(subtotal)}</div>
          <button class="btn-outline-danger btn-remove-item" data-index="${index}" title="Xóa sản phẩm">
            ✕ Xóa
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Gắn sự kiện xóa từng item
  document.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      removeCartItem(idx);
      showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
      renderCartView();
    });
  });

  // Nút xóa tất cả
  const clearAllBtn = document.getElementById('btn-clear-all-cart');
  if (clearAllBtn) {
    clearAllBtn.onclick = () => {
      if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
        clearCart();
        showToast('Đã xóa sạch giỏ hàng', 'info');
        renderCartView();
      }
    };
  }

  // Cập nhật tóm tắt thanh toán
  const total = getCartTotal();
  const summaryTotalEl = document.getElementById('cart-summary-total');
  if (summaryTotalEl) {
    summaryTotalEl.textContent = formatVnd(total);
  }
  const grandTotalEl = document.getElementById('cart-summary-grand-total');
  if (grandTotalEl) {
    grandTotalEl.textContent = formatVnd(total);
  }
}

/**
 * Xử lý biểu mẫu thông tin khách hàng và đặt đơn
 */
function setupCheckoutForm() {
  const form = document.getElementById('customer-checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cart = getCart();
    if (!cart.items || cart.items.length === 0) {
      showToast('Giỏ hàng trống! Hãy chọn chuyến bay hoặc tour trước.', 'warning');
      return;
    }

    const nameInput = document.getElementById('cust-name');
    const emailInput = document.getElementById('cust-email');
    const phoneInput = document.getElementById('cust-phone');
    const notesInput = document.getElementById('cust-notes');
    const consentInput = document.getElementById('cust-consent');

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const notes = notesInput?.value.trim() || '';
    const consent = consentInput?.checked;

    // Validation theo PRD
    if (!name || name.length < 2) {
      showFieldError('cust-name-error', 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).');
      nameInput.focus();
      return;
    } else {
      clearFieldError('cust-name-error');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError('cust-email-error', 'Vui lòng nhập định dạng email chính xác.');
      emailInput.focus();
      return;
    } else {
      clearFieldError('cust-email-error');
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      showFieldError('cust-phone-error', 'Vui lòng nhập số điện thoại hợp lệ tại Việt Nam (10 chữ số).');
      phoneInput.focus();
      return;
    } else {
      clearFieldError('cust-phone-error');
    }

    if (!consent) {
      showFieldError('cust-consent-error', 'Bạn cần tích đồng ý xử lý thông tin để tiếp tục.');
      return;
    } else {
      clearFieldError('cust-consent-error');
    }

    // Sinh mã tham chiếu DEMO-YYYYMMDD-XXXX
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderRef = `DEMO-${datePart}-${randPart}`;

    const totalVnd = getCartTotal();

    // Tạo tóm tắt items
    const itemsSummary = cart.items.map(it => `${it.title} (x${it.quantity})`).join(', ');

    // Thử gửi Email (nếu EmailJS được cấu hình)
    let emailStatus = 'unconfigured';
    let emailMessage = '';

    if (EMAIL_CONFIG.enabled && EMAIL_CONFIG.publicKey && EMAIL_CONFIG.serviceId && !EMAIL_CONFIG.serviceId.includes('REPLACE')) {
      try {
        if (window.emailjs) {
          window.emailjs.init(EMAIL_CONFIG.publicKey);
          await window.emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
            to_email: email,
            order_ref: orderRef,
            customer_name: name,
            customer_phone: phone,
            items_summary: itemsSummary,
            total_vnd: formatVnd(totalVnd),
            notes: notes
          });
          emailStatus = 'sent';
          emailMessage = `Đã gửi xác nhận tới ${email}`;
        }
      } catch (err) {
        console.error('Lỗi gửi email qua EmailJS:', err);
        emailStatus = 'failed';
        emailMessage = 'Không thể gửi email tự động qua EmailJS (lỗi dịch vụ hoặc quota).';
      }
    } else {
      emailStatus = 'unconfigured';
      emailMessage = 'Dịch vụ EmailJS chưa được cấu hình (enabled=false). Vui lòng sử dụng tính năng mở ứng dụng email thủ công.';
    }

    // Lưu dữ liệu vào sessionStorage cho confirmation.html (bảo mật, không lưu PII lâu dài)
    const confirmationData = {
      orderRef,
      createdAt: now.toISOString(),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      itemsSummary,
      totalVnd,
      items: cart.items,
      emailStatus,
      emailMessage
    };

    sessionStorage.setItem('vietjet_confirmation_data', JSON.stringify(confirmationData));

    // Xóa giỏ hàng sau khi đặt thành công
    clearCart();

    // Chuyển hướng tới trang xác nhận
    window.location.href = 'confirmation.html';
  });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function clearFieldError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}
