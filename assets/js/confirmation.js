// ============================================================
// VIETJET TRAVEL - CONFIRMATION CONTROLLER (confirmation.html)
// ============================================================

import { formatVnd, formatDate, escapeHtml } from './format.js';
import { APP_CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  renderConfirmation();
});

function renderConfirmation() {
  const container = document.getElementById('confirmation-content');
  if (!container) return;

  const raw = sessionStorage.getItem('vietjet_confirmation_data');
  if (!raw) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <h2>Chưa có thông tin yêu cầu đặt chỗ</h2>
        <p style="margin: 12px 0 24px 0;">Không tìm thấy thông tin đăng ký trong phiên làm việc hiện tại.</p>
        <a href="index.html" class="btn-primary">Quay về trang chủ</a>
      </div>
    `;
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><p>Dữ liệu đăng ký không hợp lệ.</p></div>`;
    return;
  }

  // Tạo mailto URL cho fallback
  const mailSubject = encodeURIComponent(`Vietjet Travel - Yêu cầu đăng ký demo ${data.orderRef}`);
  const mailBody = encodeURIComponent(
`Xin chào,

Tôi xin gửi thông tin đăng ký dịch vụ demo:
- Mã tham chiếu: ${data.orderRef}
- Khách hàng: ${data.customerName}
- Điện thoại: ${data.customerPhone}
- Chi tiết dịch vụ: ${data.itemsSummary}
- Tổng tiền dự kiến: ${formatVnd(data.totalVnd)}

(Lưu ý: Đây là email tạo tự động từ website demo Vietjet Travel)
`
  );
  const mailtoUrl = `mailto:${APP_CONFIG.supportEmail}?subject=${mailSubject}&body=${mailBody}`;

  // Trạng thái email trung thực
  let emailStatusHtml = '';
  if (data.emailStatus === 'sent') {
    emailStatusHtml = `
      <div class="email-status-card status-success">
        <strong>✓ Đã gửi email xác nhận:</strong> Thông tin yêu cầu đã được gửi tự động tới hòm thư <strong>${escapeHtml(data.customerEmail)}</strong>.
      </div>
    `;
  } else if (data.emailStatus === 'failed') {
    emailStatusHtml = `
      <div class="email-status-card status-warning">
        <strong>⚠️ Không gửi được email tự động:</strong> Dịch vụ EmailJS gặp lỗi kết nối hoặc quota. Quý khách có thể sử dụng nút mở email thủ công bên dưới.
      </div>
    `;
  } else {
    // unconfigured
    emailStatusHtml = `
      <div class="email-status-card status-notice">
        <strong>ℹ Trạng thái dịch vụ Email:</strong> 
        Website thuần Frontend (không có backend riêng) chưa kích hoạt EmailJS (mặc định disabled).
        <p style="margin-top: 6px; font-size: 0.85rem;">
          Để gửi email từ <code>${APP_CONFIG.supportEmail}</code>, người quản trị cần kết nối tài khoản EmailJS và xác minh sender trong <code>config.js</code>.
        </p>
        <div style="margin-top: 12px;">
          <a href="${mailtoUrl}" class="btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
            📧 Mở ứng dụng Email cá nhân (mailto)
          </a>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-icon-circle">✓</div>
      <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">Tiếp nhận yêu cầu thành công!</h1>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">Cảm ơn quý khách <strong>${escapeHtml(data.customerName)}</strong> đã gửi yêu cầu trải nghiệm dịch vụ demo.</p>

      <div class="confirm-ref-badge">
        ${escapeHtml(data.orderRef)}
      </div>

      <div style="background: #fff8e6; border: 1px solid #ffe599; border-radius: var(--radius-md); padding: 14px; margin-bottom: 24px; text-align: left; font-size: 0.88rem; color: #925400;">
        ⚠️ <strong>LƯU Ý QUAN TRỌNG:</strong> Đây là hệ thống <strong>mẫu demo / prototype</strong> học tập. Yêu cầu của bạn <strong>CHƯA PHẢI</strong> là vé máy bay hoặc tour du lịch đã được thanh toán và giữ chỗ chính thức.
      </div>

      ${emailStatusHtml}

      <!-- Chi tiết đơn đăng ký -->
      <div style="text-align: left; background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; margin-top: 24px;">
        <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Thông tin khách hàng</h3>
        <p style="font-size: 0.9rem; margin-bottom: 6px;">👤 Họ và tên: <strong>${escapeHtml(data.customerName)}</strong></p>
        <p style="font-size: 0.9rem; margin-bottom: 6px;">✉ Email liên hệ: <strong>${escapeHtml(data.customerEmail)}</strong></p>
        <p style="font-size: 0.9rem; margin-bottom: 14px;">📞 Điện thoại: <strong>${escapeHtml(data.customerPhone)}</strong></p>

        <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Dịch vụ đã chọn</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          ${(data.items || []).map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
              <span>${item.type === 'flight' ? '✈️' : '🏖️'} ${escapeHtml(item.title)} (×${item.quantity})</span>
              <strong style="color: var(--primary);">${formatVnd((Number(item.quantity) || 1) * (Number(item.unitPriceVnd) || 0))}</strong>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed var(--border-color); padding-top: 12px; font-size: 1.15rem; font-weight: 800;">
          <span>Tổng tiền dự kiến:</span>
          <span style="color: var(--primary); font-size: 1.45rem;">${formatVnd(data.totalVnd)}</span>
        </div>
      </div>

      <div style="margin-top: 32px; display: flex; justify-content: center; gap: 16px;">
        <a href="index.html" class="btn-primary">Về trang chủ</a>
        <a href="flights.html" class="btn-secondary">Tìm thêm chuyến bay</a>
      </div>
    </div>
  `;
}
