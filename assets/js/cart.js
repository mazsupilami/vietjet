// ============================================================
// VIETJET TRAVEL - CART SERVICE (LOCALSTORAGE)
// Schema: vietjet_demo_cart_v1
// ============================================================

const CART_KEY = 'vietjet_demo_cart_v1';

/**
 * Đọc dữ liệu giỏ hàng từ localStorage
 * @returns {{version: number, items: Array<Object>}}
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      return { version: 1, items: [] };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) {
      return { version: 1, items: [] };
    }
    return parsed;
  } catch (e) {
    console.error('Lỗi phân tích cú pháp giỏ hàng:', e);
    return { version: 1, items: [] };
  }
}

/**
 * Lưu dữ liệu giỏ hàng vào localStorage và phát sự kiện cập nhật
 * @param {{version: number, items: Array<Object>}} cart
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  } catch (e) {
    console.error('Lỗi lưu giỏ hàng vào localStorage:', e);
  }
}

/**
 * Đếm tổng số lượng sản phẩm trong giỏ
 * @returns {number}
 */
export function getCartCount() {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

/**
 * Tính tổng tiền các sản phẩm trong giỏ
 * @returns {number}
 */
export function getCartTotal() {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + ((Number(item.quantity) || 1) * (Number(item.unitPriceVnd) || 0)), 0);
}

/**
 * Thêm vé máy bay vào giỏ hàng (nếu trùng flightId + fareId thì gộp số lượng)
 */
export function addFlightToCart(flight, fare, quantity = 1) {
  const cart = getCart();
  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const existingIndex = cart.items.findIndex(
    item => item.type === 'flight' && item.id === flight.id && item.fareId === fare.id
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += qty;
  } else {
    cart.items.push({
      type: 'flight',
      id: flight.id,
      fareId: fare.id,
      cabin: fare.cabin,
      quantity: qty,
      unitPriceVnd: fare.price_vnd,
      title: `${flight.airline_name} - Chuyến bay ${flight.flight_number}`,
      route: `${flight.origin_city} (${flight.origin_code}) → ${flight.destination_city} (${flight.destination_code})`,
      departureAt: flight.departure_at,
      arrivalAt: flight.arrival_at,
      airlineLogo: flight.airline_logo,
      carryOn: fare.carry_on_kg,
      checkedBaggage: fare.checked_baggage_kg
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Thêm tour du lịch vào giỏ hàng
 */
export function addTourToCart(tour, quantity = 1, departureDate = null) {
  const cart = getCart();
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const depDate = departureDate || tour.departure_at;

  const existingIndex = cart.items.findIndex(
    item => item.type === 'tour' && item.id === tour.id && item.departureAt === depDate
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += qty;
  } else {
    cart.items.push({
      type: 'tour',
      id: tour.id,
      quantity: qty,
      unitPriceVnd: tour.price_vnd,
      title: tour.title,
      agencyName: tour.agency_name,
      airlineName: tour.airline_name,
      duration: `${tour.days} ngày ${tour.nights} đêm`,
      departureAt: depDate,
      imageUrl: tour.image_url
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Cập nhật số lượng của một mục trong giỏ
 */
export function updateCartItemQuantity(index, newQty) {
  const cart = getCart();
  const q = parseInt(newQty, 10);
  if (index >= 0 && index < cart.items.length) {
    if (q <= 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = q;
    }
    saveCart(cart);
  }
  return cart;
}

/**
 * Xóa 1 mục khỏi giỏ hàng theo index
 */
export function removeCartItem(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.items.length) {
    cart.items.splice(index, 1);
    saveCart(cart);
  }
  return cart;
}

/**
 * Xóa sạch giỏ hàng
 */
export function clearCart() {
  const cart = { version: 1, items: [] };
  saveCart(cart);
  return cart;
}

/**
 * Cập nhật số hiển thị badge trên Navbar
 */
export function syncCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'inline-block' : 'inline-block';
  });
}

// Lắng nghe cập nhật từ các tab khác và local
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY) {
    syncCartBadge();
  }
});

window.addEventListener('cartUpdated', () => {
  syncCartBadge();
});
