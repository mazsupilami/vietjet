// ============================================================
// VIETJET TRAVEL - CONFIGURATION
// ============================================================

export const APP_CONFIG = {
  appName: 'Vietjet Travel',
  tagline: 'Bay đến nơi bạn muốn. Khám phá điều bạn yêu.',
  currency: 'VND',
  locale: 'vi-VN',
  sqliteUrl: './sqlite/db.db',
  fallbackSqliteUrl: './assets/data/travel.sqlite',
  sqlJsWasmCdn: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/',
  supportEmail: 'nvhai061993@gmail.com'
};

// EmailJS Configuration (Tùy chọn - mặc định disabled theo PRD 06_BOOKING_AND_EMAIL.md)
// Chỉ bật khi người dùng đã kết nối và xác minh tài khoản EmailJS với sender nvhai061993@gmail.com
export const EMAIL_CONFIG = {
  enabled: false,
  serviceId: 'REPLACE_WITH_EMAILJS_SERVICE_ID',
  templateId: 'REPLACE_WITH_EMAILJS_TEMPLATE_ID',
  publicKey: 'REPLACE_WITH_EMAILJS_PUBLIC_KEY',
  senderEmail: 'nvhai061993@gmail.com'
};
