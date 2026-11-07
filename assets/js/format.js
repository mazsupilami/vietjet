// ============================================================
// VIETJET TRAVEL - FORMATTING & UTILITIES
// ============================================================

/**
 * Định dạng tiền tệ VND với dấu chấm phân tách hàng nghìn
 * @param {number|string} amount
 * @returns {string} ví dụ: "1.290.000 ₫"
 */
export function formatVnd(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Định dạng số nguyên có dấu chấm
 * @param {number} num
 * @returns {string} ví dụ: "1.290.000"
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('vi-VN').format(Number(num) || 0);
}

/**
 * Định dạng ngày giờ từ chuỗi ISO 8601 (có múi giờ +07:00)
 * @param {string} isoString
 * @returns {string} ví dụ: "15/12/2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Định dạng ngày kèm thứ trong tuần
 * @param {string} isoString
 * @returns {string} ví dụ: "Thứ Ba, 15/12/2026"
 */
export function formatDateFull(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Lấy giờ phút HH:mm từ chuỗi ISO
 * @param {string} isoString
 * @returns {string} ví dụ: "06:30"
 */
export function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Định dạng thời lượng bay (phút -> x giờ y phút)
 * @param {number} minutes
 * @returns {string} ví dụ: "2h 10m"
 */
export function formatDuration(minutes) {
  const m = Number(minutes) || 0;
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

/**
 * Escape HTML chuỗi động chống tấn công XSS
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Hiển thị Toast thông báo nhanh góc màn hình
 * @param {string} message
 * @param {'info'|'success'|'warning'|'danger'} type
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
