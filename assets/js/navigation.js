// ============================================================
// VIETJET TRAVEL - SHARED NAVIGATION & UI CONTROLS
// ============================================================

import { syncCartBadge } from './cart.js';

export function initNavigation() {
  // Đồng bộ số giỏ hàng
  syncCartBadge();

  // Mobile Hamburger Toggle
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Đóng drawer khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link logic
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
