// ============================================================
// VIETJET TRAVEL - DATA SERVICE (PURE SELECTORS)
// ============================================================

import { queryAll, queryOne } from './db.js';

/**
 * Lấy danh sách tất cả các hãng hàng không
 */
export async function getAirlines() {
  const sql = `SELECT code, name, logo_url, brand_color FROM airlines ORDER BY (code = 'VJ') DESC, name ASC`;
  return queryAll(sql);
}

/**
 * Lấy thông tin 1 hãng theo code
 */
export async function getAirlineByCode(code) {
  const sql = `SELECT code, name, logo_url, brand_color FROM airlines WHERE code = ?`;
  return queryOne(sql, [code]);
}

/**
 * Lấy danh sách tất cả sân bay
 */
export async function getAirports() {
  const sql = `SELECT code, city, name, country FROM airports ORDER BY city ASC`;
  return queryAll(sql);
}

/**
 * Lấy thông tin 1 sân bay theo IATA code
 */
export async function getAirportByCode(code) {
  const sql = `SELECT code, city, name, country FROM airports WHERE code = ?`;
  return queryOne(sql, [code]);
}

/**
 * Tìm kiếm danh sách chuyến bay theo tiêu chí lọc
 */
export async function searchFlights(filters = {}) {
  const {
    origin,
    destination,
    departureDate, // YYYY-MM-DD
    airline,
    stops, // 0 = direct
    cabin, // 'economy' | 'business'
    timeSlot, // 'early' (00-06), 'morning' (06-12), 'afternoon' (12-18), 'evening' (18-24)
    sortBy = 'price_asc' // 'price_asc', 'price_desc', 'departure_asc', 'duration_asc'
  } = filters;

  let whereClauses = ["f.status = 'available'"];
  let params = [];

  if (origin) {
    whereClauses.push("f.origin_code = ?");
    params.push(origin);
  }

  if (destination) {
    whereClauses.push("f.destination_code = ?");
    params.push(destination);
  }

  if (departureDate) {
    // departure_at is ISO8601 string: 2026-12-15T06:30:00+07:00
    whereClauses.push("substr(f.departure_at, 1, 10) = ?");
    params.push(departureDate);
  }

  if (airline) {
    whereClauses.push("f.airline_code = ?");
    params.push(airline);
  }

  if (stops !== undefined && stops !== null && stops !== '') {
    whereClauses.push("f.stops = ?");
    params.push(Number(stops));
  }

  if (cabin) {
    whereClauses.push("ff.cabin = ?");
    params.push(cabin);
  }

  // Lọc theo khung giờ khởi hành cục bộ (lấy giờ từ ISO: YYYY-MM-DDTHH:MM:SS)
  if (timeSlot) {
    if (timeSlot === 'early') {
      whereClauses.push("substr(f.departure_at, 12, 5) >= '00:00' AND substr(f.departure_at, 12, 5) < '06:00'");
    } else if (timeSlot === 'morning') {
      whereClauses.push("substr(f.departure_at, 12, 5) >= '06:00' AND substr(f.departure_at, 12, 5) < '12:00'");
    } else if (timeSlot === 'afternoon') {
      whereClauses.push("substr(f.departure_at, 12, 5) >= '12:00' AND substr(f.departure_at, 12, 5) < '18:00'");
    } else if (timeSlot === 'evening') {
      whereClauses.push("substr(f.departure_at, 12, 5) >= '18:00' AND substr(f.departure_at, 12, 5) <= '23:59'");
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let orderSql = 'ORDER BY from_price ASC';
  if (sortBy === 'price_desc') {
    orderSql = 'ORDER BY from_price DESC';
  } else if (sortBy === 'departure_asc') {
    orderSql = 'ORDER BY f.departure_at ASC';
  } else if (sortBy === 'duration_asc') {
    orderSql = 'ORDER BY f.duration_minutes ASC';
  }

  const sql = `
    SELECT 
      f.id,
      f.flight_number,
      f.airline_code,
      a.name AS airline_name,
      a.logo_url AS airline_logo,
      a.brand_color AS airline_brand_color,
      f.origin_code,
      orig.city AS origin_city,
      orig.name AS origin_airport_name,
      f.destination_code,
      dest.city AS destination_city,
      dest.name AS destination_airport_name,
      f.departure_at,
      f.arrival_at,
      f.duration_minutes,
      f.stops,
      f.aircraft_model,
      f.checked_baggage_note,
      f.cabin_baggage_note,
      MIN(ff.price_vnd) AS from_price,
      MAX(ff.price_vnd) AS max_price
    FROM flights f
    JOIN airlines a ON a.code = f.airline_code
    JOIN airports orig ON orig.code = f.origin_code
    JOIN airports dest ON dest.code = f.destination_code
    JOIN flight_fares ff ON ff.flight_id = f.id
    ${whereSql}
    GROUP BY f.id
    ${orderSql}
  `;

  return queryAll(sql, params);
}

/**
 * Lấy chi tiết chuyến bay theo id
 */
export async function getFlightById(id) {
  const sql = `
    SELECT 
      f.id,
      f.flight_number,
      f.airline_code,
      a.name AS airline_name,
      a.logo_url AS airline_logo,
      a.brand_color AS airline_brand_color,
      f.origin_code,
      orig.city AS origin_city,
      orig.name AS origin_airport_name,
      orig.country AS origin_country,
      f.destination_code,
      dest.city AS destination_city,
      dest.name AS destination_airport_name,
      dest.country AS destination_country,
      f.departure_at,
      f.arrival_at,
      f.duration_minutes,
      f.stops,
      f.aircraft_model,
      f.checked_baggage_note,
      f.cabin_baggage_note,
      f.status
    FROM flights f
    JOIN airlines a ON a.code = f.airline_code
    JOIN airports orig ON orig.code = f.origin_code
    JOIN airports dest ON dest.code = f.destination_code
    WHERE f.id = ?
  `;
  return queryOne(sql, [id]);
}

/**
 * Lấy danh sách các hạng vé (flight_fares) của chuyến bay
 */
export async function getFlightFares(flightId) {
  const sql = `
    SELECT 
      id,
      flight_id,
      cabin,
      price_vnd,
      carry_on_kg,
      checked_baggage_kg,
      change_policy,
      refund_policy
    FROM flight_fares
    WHERE flight_id = ?
    ORDER BY price_vnd ASC
  `;
  return queryAll(sql, [flightId]);
}

/**
 * Lấy danh sách tour du lịch
 */
export async function getTours(filters = {}) {
  const {
    featuredOnly = false,
    airline,
    timeSlot,
    sortBy = 'price_asc'
  } = filters;

  let whereClauses = [];
  let params = [];

  if (featuredOnly) {
    whereClauses.push("t.featured = 1");
  }

  if (airline) {
    whereClauses.push("t.airline_code = ?");
    params.push(airline);
  }

  if (timeSlot) {
    if (timeSlot === 'early') {
      whereClauses.push("substr(t.departure_at, 12, 5) >= '00:00' AND substr(t.departure_at, 12, 5) < '06:00'");
    } else if (timeSlot === 'morning') {
      whereClauses.push("substr(t.departure_at, 12, 5) >= '06:00' AND substr(t.departure_at, 12, 5) < '12:00'");
    } else if (timeSlot === 'afternoon') {
      whereClauses.push("substr(t.departure_at, 12, 5) >= '12:00' AND substr(t.departure_at, 12, 5) < '18:00'");
    } else if (timeSlot === 'evening') {
      whereClauses.push("substr(t.departure_at, 12, 5) >= '18:00' AND substr(t.departure_at, 12, 5) <= '23:59'");
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  let orderSql = 'ORDER BY t.price_vnd ASC';
  if (sortBy === 'price_desc') {
    orderSql = 'ORDER BY t.price_vnd DESC';
  } else if (sortBy === 'days_asc') {
    orderSql = 'ORDER BY t.days ASC';
  } else if (sortBy === 'days_desc') {
    orderSql = 'ORDER BY t.days DESC';
  }

  const sql = `
    SELECT 
      t.id,
      t.title,
      t.agency_id,
      ag.name AS agency_name,
      t.airline_code,
      al.name AS airline_name,
      al.logo_url AS airline_logo,
      t.origin_code,
      t.destination_code,
      t.departure_at,
      t.flight_duration_minutes,
      t.aircraft_model,
      t.days,
      t.nights,
      t.price_vnd,
      t.image_url,
      t.included_services,
      t.excluded_services,
      t.cancellation_policy,
      t.featured
    FROM tours t
    JOIN travel_agencies ag ON ag.id = t.agency_id
    LEFT JOIN airlines al ON al.code = t.airline_code
    ${whereSql}
    ${orderSql}
  `;

  return queryAll(sql, params);
}

/**
 * Lấy chi tiết 1 tour theo ID
 */
export async function getTourById(id) {
  const sql = `
    SELECT 
      t.id,
      t.title,
      t.agency_id,
      ag.name AS agency_name,
      t.airline_code,
      al.name AS airline_name,
      al.logo_url AS airline_logo,
      t.origin_code,
      orig.city AS origin_city,
      t.destination_code,
      dest.city AS destination_city,
      t.departure_at,
      t.flight_duration_minutes,
      t.aircraft_model,
      t.days,
      t.nights,
      t.price_vnd,
      t.image_url,
      t.included_services,
      t.excluded_services,
      t.cancellation_policy,
      t.featured
    FROM tours t
    JOIN travel_agencies ag ON ag.id = t.agency_id
    LEFT JOIN airlines al ON al.code = t.airline_code
    LEFT JOIN airports orig ON orig.code = t.origin_code
    LEFT JOIN airports dest ON dest.code = t.destination_code
    WHERE t.id = ?
  `;
  return queryOne(sql, [id]);
}

/**
 * Lấy lịch trình từng ngày của 1 tour
 */
export async function getTourItinerary(tourId) {
  const sql = `
    SELECT day_number, title, description
    FROM tour_itinerary
    WHERE tour_id = ?
    ORDER BY day_number ASC
  `;
  return queryAll(sql, [tourId]);
}
