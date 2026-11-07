-- ============================================================
-- VIETJET TRAVEL DEMO - SQLITE SEED DATA
-- File: sqlite/02_seed.sql
-- Description: Seed data for airlines, airports, flights,
--              flight fares, travel agencies, tours and itineraries.
-- ============================================================

-- 1. HÃNG HÀNG KHÔNG (AIRLINES) - Tối thiểu 6 hãng
INSERT INTO airlines (code, name, logo_url, brand_color) VALUES
('VJ', 'Vietjet Air', 'images/vietjet-logo.jpg', '#ee1d23'),
('VN', 'Vietnam Airlines', 'assets/images/airlines/vn.svg', '#004c8f'),
('QH', 'Bamboo Airways', 'assets/images/airlines/qh.svg', '#007854'),
('VU', 'Vietravel Airlines', 'assets/images/airlines/vu.svg', '#fecb00'),
('SQ', 'Singapore Airlines', 'assets/images/airlines/sq.svg', '#1b365d'),
('TR', 'Scoot', 'assets/images/airlines/tr.svg', '#ffe600');

-- 2. SÂN BAY (AIRPORTS) - Tối thiểu 8 sân bay
INSERT INTO airports (code, city, name, country) VALUES
('SGN', 'TP. Hồ Chí Minh', 'Sân bay Quốc tế Tân Sơn Nhất', 'Việt Nam'),
('HAN', 'Hà Nội', 'Sân bay Quốc tế Nội Bài', 'Việt Nam'),
('DAD', 'Đà Nẵng', 'Sân bay Quốc tế Đà Nẵng', 'Việt Nam'),
('CXR', 'Nha Trang', 'Sân bay Quốc tế Cam Ranh', 'Việt Nam'),
('PQC', 'Phú Quốc', 'Sân bay Quốc tế Phú Quốc', 'Việt Nam'),
('DLI', 'Đà Lạt', 'Sân bay Liên Khương', 'Việt Nam'),
('SIN', 'Singapore', 'Sân bay Quốc tế Changi', 'Singapore'),
('BKK', 'Bangkok', 'Sân bay Quốc tế Suvarnabhumi', 'Thái Lan'),
('DPS', 'Bali', 'Sân bay Quốc tế Ngurah Rai', 'Indonesia');

-- 3. CÔNG TY LỮ HÀNH (TRAVEL AGENCIES)
INSERT INTO travel_agencies (id, name) VALUES
('VJ_HOLIDAYS', 'Vietjet Holidays'),
('SAIGONTOURIST', 'Saigontourist'),
('VIETRAVEL', 'Vietravel'),
('BEN_THANH', 'Bến Thành Tourist');

-- 4. CHUYẾN BAY (FLIGHTS) - 28 chuyến bay (nội địa + quốc tế, bay thẳng + dừng, nhiều khung giờ)
INSERT INTO flights (id, airline_code, flight_number, origin_code, destination_code, departure_at, arrival_at, duration_minutes, stops, aircraft_model, checked_baggage_note, cabin_baggage_note, status) VALUES
-- Ngày test chuẩn: 2026-12-15 SGN -> HAN
('VJ120', 'VJ', 'VJ 120', 'SGN', 'HAN', '2026-12-15T06:30:00+07:00', '2026-12-15T08:40:00+07:00', 130, 0, 'Airbus A321neo', '20kg ký gửi (tùy hạng)', '7kg xách tay tiêu chuẩn', 'available'),
('VN214', 'VN', 'VN 214', 'SGN', 'HAN', '2026-12-15T09:15:00+07:00', '2026-12-15T11:25:00+07:00', 130, 0, 'Boeing 787-9 Dreamliner', '23kg ký gửi miễn phí', '10kg xách tay tiêu chuẩn', 'available'),
('QH152', 'QH', 'QH 152', 'SGN', 'HAN', '2026-12-15T14:20:00+07:00', '2026-12-15T16:30:00+07:00', 130, 0, 'Airbus A320neo', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VJ138', 'VJ', 'VJ 138', 'SGN', 'HAN', '2026-12-15T19:30:00+07:00', '2026-12-15T21:40:00+07:00', 130, 0, 'Airbus A330-300', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VU782', 'VU', 'VU 782', 'SGN', 'HAN', '2026-12-15T05:45:00+07:00', '2026-12-15T08:00:00+07:00', 135, 0, 'Airbus A321', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),

-- Ngày test chuẩn: 2026-12-15 SGN -> DAD
('VJ622', 'VJ', 'VJ 622', 'SGN', 'DAD', '2026-12-15T07:10:00+07:00', '2026-12-15T08:30:00+07:00', 80, 0, 'Airbus A320', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN116', 'VN', 'VN 116', 'SGN', 'DAD', '2026-12-15T13:45:00+07:00', '2026-12-15T15:05:00+07:00', 80, 0, 'Airbus A321', '23kg ký gửi miễn phí', '10kg xách tay', 'available'),
('QH170', 'QH', 'QH 170', 'SGN', 'DAD', '2026-12-15T18:15:00+07:00', '2026-12-15T19:35:00+07:00', 80, 0, 'Airbus A320neo', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),

-- Ngày test chuẩn: 2026-12-18 HAN -> DAD (Multicity leg 2)
('VJ503', 'VJ', 'VJ 503', 'HAN', 'DAD', '2026-12-18T08:00:00+07:00', '2026-12-18T09:20:00+07:00', 80, 0, 'Airbus A321', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN167', 'VN', 'VN 167', 'HAN', 'DAD', '2026-12-18T15:10:00+07:00', '2026-12-18T16:30:00+07:00', 80, 0, 'Airbus A321', '23kg ký gửi', '10kg xách tay', 'available'),

-- Ngày test chuẩn: 2026-12-20 DAD -> SGN (Khứ hồi từ DAD về SGN)
('VJ629', 'VJ', 'VJ 629', 'DAD', 'SGN', '2026-12-20T10:15:00+07:00', '2026-12-20T11:40:00+07:00', 85, 0, 'Airbus A320', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN127', 'VN', 'VN 127', 'DAD', 'SGN', '2026-12-20T16:40:00+07:00', '2026-12-20T18:05:00+07:00', 85, 0, 'Airbus A321', '23kg ký gửi', '10kg xách tay', 'available'),

-- Chiều về HAN -> SGN 2026-12-20
('VJ127', 'VJ', 'VJ 127', 'HAN', 'SGN', '2026-12-20T09:00:00+07:00', '2026-12-20T11:15:00+07:00', 135, 0, 'Airbus A321neo', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN219', 'VN', 'VN 219', 'HAN', 'SGN', '2026-12-20T18:30:00+07:00', '2026-12-20T20:45:00+07:00', 135, 0, 'Boeing 787-9', '23kg ký gửi', '10kg xách tay', 'available'),

-- Chặng SGN <-> PQC (Phú Quốc)
('VJ323', 'VJ', 'VJ 323', 'SGN', 'PQC', '2026-12-15T07:45:00+07:00', '2026-12-15T08:45:00+07:00', 60, 0, 'Airbus A321', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN1823', 'VN', 'VN 1823', 'SGN', 'PQC', '2026-12-15T11:00:00+07:00', '2026-12-15T12:00:00+07:00', 60, 0, 'ATR 72 / A321', '23kg ký gửi', '10kg xách tay', 'available'),
('VJ328', 'VJ', 'VJ 328', 'PQC', 'SGN', '2026-12-19T14:30:00+07:00', '2026-12-19T15:30:00+07:00', 60, 0, 'Airbus A321', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),

-- Chặng SGN <-> CXR (Nha Trang)
('VJ602', 'VJ', 'VJ 602', 'SGN', 'CXR', '2026-12-15T08:20:00+07:00', '2026-12-15T09:25:00+07:00', 65, 0, 'Airbus A320', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN1358', 'VN', 'VN 1358', 'SGN', 'CXR', '2026-12-15T17:15:00+07:00', '2026-12-15T18:20:00+07:00', 65, 0, 'Airbus A321', '23kg ký gửi', '10kg xách tay', 'available'),

-- Chặng SGN <-> DLI (Đà Lạt)
('VJ408', 'VJ', 'VJ 408', 'SGN', 'DLI', '2026-12-15T10:10:00+07:00', '2026-12-15T11:05:00+07:00', 55, 0, 'Airbus A320', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('VN1380', 'VN', 'VN 1380', 'SGN', 'DLI', '2026-12-15T15:30:00+07:00', '2026-12-15T16:25:00+07:00', 55, 0, 'Airbus A321', '23kg ký gửi', '10kg xách tay', 'available'),

-- Chặng Quốc tế: SGN <-> SIN (Singapore)
('VJ813', 'VJ', 'VJ 813', 'SGN', 'SIN', '2026-12-15T08:55:00+07:00', '2026-12-15T12:00:00+08:00', 125, 0, 'Airbus A321', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('SQ177', 'SQ', 'SQ 177', 'SGN', 'SIN', '2026-12-15T12:15:00+07:00', '2026-12-15T15:20:00+08:00', 125, 0, 'Boeing 787-10', '30kg ký gửi miễn phí', '7kg xách tay', 'available'),
('SQ186', 'SQ', 'SQ 186', 'SIN', 'SGN', '2026-12-20T17:30:00+08:00', '2026-12-20T18:35:00+07:00', 125, 0, 'Airbus A350-900', '30kg ký gửi miễn phí', '7kg xách tay', 'available'),

-- Chặng Quốc tế: SGN <-> BKK (Bangkok)
('VJ803', 'VJ', 'VJ 803', 'SGN', 'BKK', '2026-12-15T11:15:00+07:00', '2026-12-15T12:45:00+07:00', 90, 0, 'Airbus A321neo', '20kg ký gửi (tùy hạng)', '7kg xách tay', 'available'),
('TR684', 'TR', 'TR 684', 'SGN', 'BKK', '2026-12-15T16:20:00+07:00', '2026-12-15T17:55:00+07:00', 95, 0, 'Airbus A320neo', '20kg ký gửi (tùy hạng)', '10kg xách tay', 'available'),

-- Chuyến bay có 1 điểm dừng (1 stop) để test bộ lọc Bay thẳng / Điểm dừng
('VN7201', 'VN', 'VN 7201', 'SGN', 'HAN', '2026-12-15T11:30:00+07:00', '2026-12-15T15:40:00+07:00', 250, 1, 'Airbus A321', '23kg ký gửi', '10kg xách tay (Quá cảnh tại DAD 45p)', 'available'),
('VJ9811', 'VJ', 'VJ 9811', 'SGN', 'SIN', '2026-12-15T13:00:00+07:00', '2026-12-15T18:10:00+08:00', 250, 1, 'Airbus A320', '20kg ký gửi', '7kg xách tay (Quá cảnh tại DAD 50p)', 'available');

-- 5. GIÁ VÉ & HẠNG GHẾ (FLIGHT FARES) - 2 hạng vé (economy & business) cho mỗi chuyến bay
INSERT INTO flight_fares (id, flight_id, cabin, price_vnd, carry_on_kg, checked_baggage_kg, change_policy, refund_policy) VALUES
('FF_VJ120_E', 'VJ120', 'economy', 890000, 7, 0, 'Đổi vé có thu phí 350.000đ + chênh lệch giá', 'Không hoàn vé'),
('FF_VJ120_B', 'VJ120', 'business', 2890000, 14, 30, 'Miễn phí đổi ngày bay, phòng chờ hạng thương gia', 'Hoàn vé thu phí 500.000đ'),

('FF_VN214_E', 'VN214', 'economy', 1450000, 10, 23, 'Đổi vé phí 400.000đ + chênh lệch giá', 'Không hoàn vé hoặc phí 600.000đ'),
('FF_VN214_B', 'VN214', 'business', 4150000, 14, 32, 'Miễn phí đổi vé, ưu tiên làm thủ tục, phòng chờ Lotus', 'Hoàn vé phí 300.000đ'),

('FF_QH152_E', 'QH152', 'economy', 1050000, 7, 20, 'Đổi vé phí 370.000đ', 'Không hoàn vé'),
('FF_QH152_B', 'QH152', 'business', 3200000, 14, 30, 'Miễn phí đổi vé, suất ăn nóng thương gia', 'Hoàn phí 400.000đ'),

('FF_VJ138_E', 'VJ138', 'economy', 780000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ138_B', 'VJ138', 'business', 2650000, 14, 30, 'Miễn phí đổi ngày bay, ghế ngả rộng rãi', 'Hoàn vé thu phí 500.000đ'),

('FF_VU782_E', 'VU782', 'economy', 690000, 7, 0, 'Đổi vé có phí 360.000đ', 'Không hoàn vé'),
('FF_VU782_B', 'VU782', 'business', 2290000, 14, 25, 'Miễn phí đổi vé', 'Hoàn vé thu phí 450.000đ'),

('FF_VJ622_E', 'VJ622', 'economy', 650000, 7, 0, 'Đổi vé có thu phí 350.000đ', 'Không hoàn vé'),
('FF_VJ622_B', 'VJ622', 'business', 2100000, 14, 30, 'Miễn phí đổi ngày bay', 'Hoàn vé phí 450.000đ'),

('FF_VN116_E', 'VN116', 'economy', 1190000, 10, 23, 'Đổi vé phí 380.000đ', 'Không hoàn vé'),
('FF_VN116_B', 'VN116', 'business', 3150000, 14, 32, 'Miễn phí đổi vé, ưu tiên lối đi riêng', 'Hoàn vé phí 300.000đ'),

('FF_QH170_E', 'QH170', 'economy', 890000, 7, 20, 'Đổi vé phí 370.000đ', 'Không hoàn vé'),
('FF_QH170_B', 'QH170', 'business', 2450000, 14, 30, 'Miễn phí đổi vé, phòng chờ riêng', 'Hoàn vé phí 350.000đ'),

('FF_VJ503_E', 'VJ503', 'economy', 620000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ503_B', 'VJ503', 'business', 2050000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 450.000đ'),

('FF_VN167_E', 'VN167', 'economy', 1150000, 10, 23, 'Đổi vé phí 380.000đ', 'Không hoàn vé'),
('FF_VN167_B', 'VN167', 'business', 2990000, 14, 32, 'Miễn phí đổi vé, dịch vụ hạng sang', 'Hoàn vé phí 300.000đ'),

('FF_VJ629_E', 'VJ629', 'economy', 720000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ629_B', 'VJ629', 'business', 2250000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 450.000đ'),

('FF_VN127_E', 'VN127', 'economy', 1250000, 10, 23, 'Đổi vé phí 380.000đ', 'Không hoàn vé'),
('FF_VN127_B', 'VN127', 'business', 3250000, 14, 32, 'Miễn phí đổi vé', 'Hoàn vé phí 300.000đ'),

('FF_VJ127_E', 'VJ127', 'economy', 920000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ127_B', 'VJ127', 'business', 2850000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 500.000đ'),

('FF_VN219_E', 'VN219', 'economy', 1520000, 10, 23, 'Đổi vé phí 400.000đ', 'Không hoàn vé'),
('FF_VN219_B', 'VN219', 'business', 4290000, 14, 32, 'Miễn phí đổi vé, Lotus Lounge', 'Hoàn vé phí 300.000đ'),

('FF_VJ323_E', 'VJ323', 'economy', 590000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ323_B', 'VJ323', 'business', 1950000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 400.000đ'),

('FF_VN1823_E', 'VN1823', 'economy', 1080000, 10, 23, 'Đổi vé phí 380.000đ', 'Không hoàn vé'),
('FF_VN1823_B', 'VN1823', 'business', 2790000, 14, 32, 'Miễn phí đổi vé', 'Hoàn vé phí 300.000đ'),

('FF_VJ328_E', 'VJ328', 'economy', 630000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ328_B', 'VJ328', 'business', 1980000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 400.000đ'),

('FF_VJ602_E', 'VJ602', 'economy', 580000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ602_B', 'VJ602', 'business', 1890000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 400.000đ'),

('FF_VN1358_E', 'VN1358', 'economy', 1020000, 10, 23, 'Đổi vé phí 380.000đ', 'Không hoàn vé'),
('FF_VN1358_B', 'VN1358', 'business', 2650000, 14, 32, 'Miễn phí đổi vé', 'Hoàn vé phí 300.000đ'),

('FF_VJ408_E', 'VJ408', 'economy', 550000, 7, 0, 'Đổi vé có phí 350.000đ', 'Không hoàn vé'),
('FF_VJ408_B', 'VJ408', 'business', 1820000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 400.000đ'),

('FF_VN1380_E', 'VN1380', 'economy', 990000, 10, 23, 'Đổi vé phí 380.000đ', 'Không hoàn vé'),
('FF_VN1380_B', 'VN1380', 'business', 2550000, 14, 32, 'Miễn phí đổi vé', 'Hoàn vé phí 300.000đ'),

('FF_VJ813_E', 'VJ813', 'economy', 1490000, 7, 0, 'Đổi vé có phí 700.000đ', 'Không hoàn vé'),
('FF_VJ813_B', 'VJ813', 'business', 4650000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 750.000đ'),

('FF_SQ177_E', 'SQ177', 'economy', 2850000, 7, 25, 'Đổi vé phí 800.000đ', 'Hoàn vé phí 1.200.000đ'),
('FF_SQ177_B', 'SQ177', 'business', 8900000, 14, 40, 'Miễn phí đổi ngày bay, SilverKris Lounge', 'Miễn phí hoàn vé trước 24h'),

('FF_SQ186_E', 'SQ186', 'economy', 2950000, 7, 25, 'Đổi vé phí 800.000đ', 'Hoàn vé phí 1.200.000đ'),
('FF_SQ186_B', 'SQ186', 'business', 9100000, 14, 40, 'Miễn phí đổi vé', 'Miễn phí hoàn vé trước 24h'),

('FF_VJ803_E', 'VJ803', 'economy', 1290000, 7, 0, 'Đổi vé có phí 650.000đ', 'Không hoàn vé'),
('FF_VJ803_B', 'VJ803', 'business', 3890000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 650.000đ'),

('FF_TR684_E', 'TR684', 'economy', 1350000, 10, 0, 'Đổi vé có phí 600.000đ', 'Không hoàn vé'),
('FF_TR684_B', 'TR684', 'business', 3650000, 15, 30, 'Miễn phí đổi vé (ScootPlus)', 'Hoàn vé voucher Scoot'),

('FF_VN7201_E', 'VN7201', 'economy', 1190000, 10, 23, 'Đổi vé phí 400.000đ', 'Không hoàn vé'),
('FF_VN7201_B', 'VN7201', 'business', 3450000, 14, 32, 'Miễn phí đổi vé', 'Hoàn vé phí 300.000đ'),

('FF_VJ9811_E', 'VJ9811', 'economy', 1250000, 7, 0, 'Đổi vé có phí 650.000đ', 'Không hoàn vé'),
('FF_VJ9811_B', 'VJ9811', 'business', 3990000, 14, 30, 'Miễn phí đổi vé', 'Hoàn vé phí 700.000đ');

-- 6. TOURS DU LỊCH (TOURS) - Tối thiểu 8 tour featured
INSERT INTO tours (id, title, agency_id, airline_code, origin_code, destination_code, departure_at, flight_duration_minutes, aircraft_model, days, nights, price_vnd, image_url, included_services, excluded_services, cancellation_policy, featured) VALUES
(
  'T001',
  'Phú Quốc: Nghỉ dưỡng Nam Đảo, Cáp treo Hòn Thơm & Sunset Sanato',
  'VJ_HOLIDAYS',
  'VJ',
  'SGN',
  'PQC',
  '2026-12-15T07:45:00+07:00',
  60,
  'Airbus A321',
  4,
  3,
  4990000,
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietjet Air, Khách sạn 4 sao sát biển, Xe đưa đón đời mới, Vé cáp treo Hòn Thơm, 03 bữa sáng buffet + 05 bữa chính hải sản, Hướng dẫn viên địa phương, Bảo hiểm du lịch 50.000.000đ',
  'Chi phí cá nhân, đồ uống gọi thêm trong bữa ăn, Thuế VAT 8%, Tiền tip tài xế và HDV',
  'Hủy trước 15 ngày: Miễn phí. Hủy trước 7-14 ngày: Phạt 50% tổng giá tour. Hủy trước 3-6 ngày: Phạt 80%. Hủy trong vòng 3 ngày: Phạt 100%.',
  1
),
(
  'T002',
  'Đà Nẵng – Hội An – Bà Nà Hills: Check-in Cầu Vàng & Phố Cổ Lung Linh',
  'VIETRAVEL',
  'VJ',
  'SGN',
  'DAD',
  '2026-12-15T07:10:00+07:00',
  80,
  'Airbus A320',
  3,
  2,
  3890000,
  'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietjet Air, Khách sạn 4 sao trung tâm biển Mỹ Khê, Vé cáp treo Bà Nà Hills & buffet trưa, Vé tham quan Phố cổ Hội An, Thuyền thả hoa đăng sông Hoài, Hướng dẫn viên, Nước suối 1 chai/ngày',
  'Vé bảo tàng sáp Bà Nà, Chi phí cá nhân, Thuế VAT, Tiền tip tùy tâm',
  'Hủy trước 10 ngày: Miễn phí. Hủy trước 5-9 ngày: Phạt 50%. Hủy trong vòng 4 ngày: Phạt 100%.',
  1
),
(
  'T003',
  'Đà Lạt: Xứ sở sương mù, Check-in Đồi Chè Cầu Đất & Thác Datanla',
  'BEN_THANH',
  'VJ',
  'SGN',
  'DLI',
  '2026-12-15T10:10:00+07:00',
  55,
  'Airbus A320',
  3,
  2,
  4290000,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietjet Air, Khách sạn 3-4 sao gần Hồ Xuân Hương, Vé máng trượt Thác Datanla, Buffet rau Léguda, Hướng dẫn viên suốt tuyến, Xe tham quan có máy lạnh',
  'Chi phí cá nhân, Đồ uống ngoài chương trình, Thuế VAT',
  'Hủy trước 7 ngày miễn phí. Hủy trước 3 ngày phạt 50%. Hủy sát ngày phạt 100%.',
  1
),
(
  'T004',
  'Nha Trang: Vịnh ngọc biển xanh, Du ngoạn 3 đảo & Vui chơi VinWonders',
  'SAIGONTOURIST',
  'VN',
  'SGN',
  'CXR',
  '2026-12-15T17:15:00+07:00',
  65,
  'Airbus A321',
  4,
  3,
  5490000,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietnam Airlines (23kg ký gửi), Khách sạn 5 sao mặt biển, Vé trọn gói VinWonders Nha Trang, Ca nô cao tốc khám phá Hòn Mun - Hòn Tằm, Tắm bùn khoáng nóng Tháp Bà',
  'Chi phí lặn ngắm san hô bằng bình dưỡng khí, Dù bay moto nước, Thuế VAT, Phụ thu phòng đơn',
  'Hủy trước 14 ngày: Không tính phí. Hủy trước 7 ngày: 40%. Hủy trước 3 ngày: 80%. Sau đó 100%.',
  1
),
(
  'T005',
  'Hà Nội – Hạ Long – Ninh Bình: Du thuyền 5 sao vịnh di sản & Tràng An',
  'VIETRAVEL',
  'VN',
  'SGN',
  'HAN',
  '2026-12-15T09:15:00+07:00',
  130,
  'Boeing 787-9 Dreamliner',
  4,
  3,
  6890000,
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietnam Airlines, 01 đêm du thuyền 5 sao Vịnh Hạ Long, 02 đêm khách sạn 4 sao Hà Nội Phố Cổ, Thuyền nan khám phá Tràng An, Vé xem múa rối nước, Các bữa ăn theo tiêu chuẩn cao',
  'Chi phí đồ uống quầy bar du thuyền, Tiền tip HDV, Thuế VAT',
  'Hủy trước 15 ngày miễn phí hoàn toàn. Hủy trước 7 ngày phạt 50%. Sau đó phạt 100%.',
  1
),
(
  'T006',
  'Bangkok – Pattaya: Thành phố không ngủ, Đảo San Hô & Safari World',
  'VJ_HOLIDAYS',
  'VJ',
  'SGN',
  'BKK',
  '2026-12-15T11:15:00+07:00',
  90,
  'Airbus A321neo',
  5,
  4,
  7490000,
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietjet Air (20kg ký gửi), Khách sạn 4 sao tiêu chuẩn Thái Lan, Tàu cao tốc đi Đảo San Hô Koh Larn, Vé xem Alcazar Cabaret Show, Buffet quốc tế tòa nhà Baiyoke Sky 86 tầng',
  'Tiền bồi dưỡng (tip) bắt buộc cho HDV và lái xe: 5 USD/khách/ngày (~650.000đ/tour), Hộ chiếu còn hạn trên 6 tháng, Chi tiêu cá nhân',
  'Hủy tour sau khi đăng ký: phạt cọc 50%. Hủy trước 10 ngày: 70%. Hủy trước 5 ngày: 100%.',
  1
),
(
  'T007',
  'Singapore: Đảo quốc Sư Tử, Gardens by the Bay & Đảo Sentosa',
  'SAIGONTOURIST',
  'SQ',
  'SGN',
  'SIN',
  '2026-12-15T12:15:00+07:00',
  125,
  'Boeing 787-10',
  4,
  3,
  11990000,
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi 5 sao Singapore Airlines (30kg ký gửi), Khách sạn 4 sao trung tâm Orchard/Chinatown, Vé tham quan 2 nhà kính Flower Dome & Cloud Forest, Vé cáp treo Sentosa, Lẩu Sukiya',
  'Tiền tip HDV 5 USD/ngày, Thuế VAT, Vé Universal Studios Singapore (tùy chọn tự túc)',
  'Hủy trước 20 ngày miễn phí. Hủy trước 10 ngày: 50%. Hủy trước 5 ngày: 100%.',
  1
),
(
  'T008',
  'Bali nhiệt đới: Check-in Cổng Trời Lempuyang & Xích đu Ubud Swing',
  'BEN_THANH',
  'VJ',
  'SGN',
  'DPS',
  '2026-12-16T08:00:00+07:00',
  240,
  'Airbus A321',
  4,
  3,
  9890000,
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format&q=70',
  'Vé máy bay khứ hồi Vietjet Air, Resort 4 sao phong cách Bali truyền thống, Xe riêng tham quan suốt hành trình, Vé Cổng trời Lempuyang, Bữa tối hải sản lãng mạn trên bãi biển Jimbaran',
  'Thuế du lịch Bali nộp tại sân bay (~250.000đ), Tiền tip tài xế địa phương, Chi tiêu cá nhân',
  'Hủy trước 15 ngày mất cọc 30%. Hủy trước 7 ngày phạt 70%. Hủy trong 7 ngày phạt 100%.',
  1
);

-- 7. LỊCH TRÌNH TOUR CHI TIẾT (TOUR ITINERARY)
-- T001: Phú Quốc 4N3Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T001', 1, 'TP.HCM – Phú Quốc – Khám phá Đông Đảo', 'Sáng: Quý khách tập trung tại Tân Sơn Nhất, bay chuyến VJ323 đi Phú Quốc. Xe đón đoàn về resort nhận phòng. Chiều: Viếng Dinh Cậu, Dinh Bà Thủy Long Thánh Mẫu, tham quan Làng chài Hàm Ninh thưởng thức ghẹ tươi. Tối: Thưởng thức ẩm thực chợ đêm Phú Quốc.'),
('T001', 2, 'Cáp treo Hòn Thơm – Trải nghiệm Công viên nước Aquatopia', 'Sáng: Khởi hành đến Ga An Thới, trải nghiệm tuyến cáp treo vượt biển 3 dây dài nhất thế giới sang Đảo Hòn Thơm. Vui chơi thỏa thích tại công viên nước Aquatopia. Trưa: Buffet hải sản tại Hòn Thơm. Chiều: Về Bãi Sao đắm mình trong làn nước biển trong vắt cát trắng mịn.'),
('T001', 3, 'Nam Đảo – Check-in Sunset Sanato – Grand World Phú Quốc', 'Sáng: Tham quan Cơ sở nuôi cấy Ngọc Trai, Vườn Tiêu Suối Đá, Nhà thùng Nước Mắm truyền thống. Chiều: Check-in Sunset Sanato ngắm hoàng hôn tuyệt đẹp với các tượng nghệ thuật trên bãi biển. Tối: Xe đưa đoàn đến "Thành phố không ngủ" Grand World ngắm show Tinh Hoa Việt Nam sắc màu.'),
('T001', 4, 'Mua sắm đặc sản Phú Quốc – Bay về TP.HCM', 'Sáng: Tự do tắm biển, hồ bơi tại resort hoặc đi chợ Dương Đông mua sắm hải sản khô, rượu sim. Trưa: Làm thủ tục trả phòng, xe đưa đoàn ra sân bay Phú Quốc đáp chuyến bay về lại TP.HCM. Kết thúc hành trình đầy ắp kỷ niệm.');

-- T002: Đà Nẵng – Hội An 3N2Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T002', 1, 'TP.HCM – Đà Nẵng – Bán đảo Sơn Trà – Ngũ Hành Sơn – Phố Cổ Hội An', 'Sáng: Đáp chuyến bay VJ622 đến Đà Nẵng, xe đưa viếng Chùa Linh Ứng Bãi Bụt chiêm bái tượng Phật Bà Quan Âm 67m. Trưa: Ăn trưa đặc sản Bánh tráng cuốn thịt heo hai đầu da. Chiều: Tham quan Ngũ Hành Sơn, Làng đá Non Nước rồi di chuyển về Phố Cổ Hội An ngắm đèn lồng, thả hoa đăng sông Hoài.'),
('T002', 2, 'Bà Nà Hills – Đường Lên Tiên Cảnh – Check-in Cầu Vàng', 'Sáng: Khởi hành đi Bà Nà Hills. Trải nghiệm tuyến cáp treo đạt nhiều kỷ lục Guinness. Check-in Cầu Vàng Bàn Tay Khổng Lồ vươn giữa mây trời, Làng Pháp cổ kính. Trưa: Thưởng thức đại tiệc buffet hơn 100 món tại nhà hàng Arapang. Chiều: Vui chơi tại Fantasy Park rồi về lại trung tâm Đà Nẵng tắm biển Mỹ Khê.'),
('T002', 3, 'Cầu Rồng – Chợ Hàn – Mua quà đặc sản – Bay về TP.HCM', 'Sáng: Dạo bước ngắm Cầu Rồng, Cầu Tình Yêu, tượng Cá Chép Hóa Rồng. Sau đó tự do mua sắm đặc sản Chả bò Đà Nẵng, mực một nắng tại Chợ Hàn. Trưa: Trả phòng, thưởng thức Mì Quảng ếch trứ danh. Chiều: Xe tiễn đoàn ra sân bay Đà Nẵng làm thủ tục về lại TP.HCM.');

-- T003: Đà Lạt 3N2Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T003', 1, 'TP.HCM – Sân bay Liên Khương – Đà Lạt – Dinh Bảo Đại – Ga Đà Lạt', 'Sáng: Bay chuyến VJ408 lên Đà Lạt thơ mộng. Xe đón về trung tâm thành phố, ăn trưa với lẩu gà lá é. Chiều: Tham quan Dinh 3 Bảo Đại với kiến trúc Pháp cổ điển, Ga Đà Lạt cổ kính nhất Đông Dương. Tối: Dạo quanh Hồ Xuân Hương ngắm sương mù se lạnh, thưởng thức bánh tráng nướng và sữa đậu nành nóng hổi.'),
('T003', 2, 'Thung Lũng Tình Yêu – Thác Datanla – Đồi Chè Cầu Đất', 'Sáng: Check-in Đồi Chè Cầu Đất xanh bạt ngàn đón mây, tham quan cánh đồng quạt gió. Trưa: Ăn buffet rau không giới hạn Léguda trên đỉnh đèo Robin ngắm trọn thành phố. Chiều: Trải nghiệm máng trượt uốn lượn xuyên rừng thông tại Thác Datanla. Tối: Tự do khám phá Chợ đêm Âm Phủ.'),
('T003', 3, 'Quảng trường Lâm Viên – Chợ Đà Lạt – Về lại TP.HCM', 'Sáng: Chụp ảnh lưu niệm tại nụ hoa Atiso và hoa Dã Quỳ khổng lồ ở Quảng trường Lâm Viên. Ghé Chợ Đà Lạt mua atiso, mứt dâu tây, hoa quả tươi sấy giòn. Trưa: Trả phòng khách sạn, xe đưa đoàn ra sân bay Liên Khương bay về TP.HCM.');

-- T004: Nha Trang 4N3Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T004', 1, 'TP.HCM – Nha Trang – Tháp Bà Ponagar – Suối khoáng nóng I-Resort', 'Sáng: Bay đến Sân bay Cam Ranh, xe đưa chạy dọc cung đường biển tuyệt đẹp về trung tâm thành phố biển Nha Trang. Chiều: Tham quan Quần thể tháp Chăm cổ Ponagar linh thiêng, ngâm bùn khoáng nóng thư giãn tại I-Resort. Tối: Dạo phố biển Trần Phú, thưởng thức bún chả cá Nha Trang.'),
('T004', 2, 'Khám phá Vịnh San Hô – Làng Chài – Hòn Tằm', 'Sáng: Ca nô cao tốc đưa đoàn lướt sóng ra Vịnh San Hô, tự do tắm biển và ngắm san hô bằng kính lặn. Trưa: Dùng bữa trưa hải sản tươi sống tại bè nổi Làng Chài. Chiều: Sang Hòn Tằm tận hưởng tổ hợp tắm bùn khoáng trên đảo lớn nhất Việt Nam và tắm hồ bơi vô cực view biển.'),
('T004', 3, 'Trọn ngày vui chơi kỳ thú tại VinWonders Nha Trang', 'Sáng: Sang Đảo Hòn Tre, bước vào thế giới giải trí đỉnh cao VinWonders: Vườn Quý Vương, Đồi Vạn Hoa King''s Garden, Tata Show hoành tráng, Vịnh phao nổi khổng lồ trên biển và bánh xe bầu trời Sky Wheel ngắm toàn cảnh vịnh Nha Trang từ độ cao 120m.'),
('T004', 4, 'Chùa Long Sơn – Chợ Đầm – Tiễn sân bay', 'Sáng: Viếng Chùa Long Sơn chiêm bái tượng Kim Thân Phật Tổ uy nghiêm. Mua sắm hải sản khô, yến sào Nha Trang tại Chợ Đầm tròn lịch sử. Chiều: Xe tiễn đoàn ra sân bay Cam Ranh bay về TP.HCM.');

-- T005: Hà Nội – Hạ Long – Ninh Bình 4N3Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T005', 1, 'TP.HCM – Hà Nội 36 Phố Phường – Văn Miếu Quốc Tử Giám – Hồ Gươm', 'Sáng: Bay ra Thủ đô Hà Nội, xe đón về trung tâm. Thưởng thức Phở bò Hà Nội gia truyền. Chiều: Viếng Văn Miếu - Quốc Tử Giám trường đại học đầu tiên của Việt Nam, dạo quanh Hồ Hoàn Kiếm, Cầu Thê Húc, Đền Ngọc Sơn. Tối: Thưởng thức bữa tối ẩm thực Bắc Bộ, dạo chợ đêm Phố Cổ Tạ Hiện.'),
('T005', 2, 'Hà Nội – Hạ Long – Lên Du thuyền 5 sao – Hang Sửng Sốt – Đảo Ti Tốp', 'Sáng: Di chuyển cao tốc Hà Nội - Hải Phòng - Hạ Long. Trưa: Check-in du thuyền 5 sao đẳng cấp, thưởng thức bữa trưa hải sản giữa non nước kỳ vĩ. Chiều: Khám phá Hang Sửng Sốt - hang động rộng và đẹp nhất vịnh; chèo kayak tại Hang Luồn; chinh phục đỉnh Ti Tốp ngắm toàn cảnh Vịnh Hạ Long.'),
('T005', 3, 'Hạ Long – Ninh Bình – Quần thể danh thắng Tràng An – Cố Đô Hoa Lư', 'Sáng: Tập Thái Cực Quyền đón bình minh trên sundeck du thuyền, ăn sáng nhẹ và ngắm hòn Trống Mái. Trưa: Tàu cập bến, xe đưa đoàn về vùng đất cố đô Ninh Bình. Chiều: Ngồi thuyền nan xuôi dòng Sào Khê xuyên qua các hang động thủy cung tại Tràng An di sản UNESCO. Tối: Thưởng thức đặc sản cơm cháy dê núi Ninh Bình.'),
('T005', 4, 'Chùa Bái Đính – Lăng Bác – Sân bay Nội Bài về TP.HCM', 'Sáng: Chiêm bái Đại tượng Phật và Hành lang La Hán tại Đại Phật Tự Bái Đính. Chiều: Trở về Hà Nội vào Lăng viếng Chủ tịch Hồ Chí Minh, tham quan Nhà Sàn, Chùa Một Cột. Xe tiễn đoàn ra sân bay Nội Bài đáp chuyến bay tối về lại TP.HCM.');

-- T006: Bangkok – Pattaya 5N4Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T006', 1, 'TP.HCM – Bangkok – Thành phố biển Pattaya', 'Sáng: Bay đến Sân bay Suvarnabhumi Bangkok. Hướng dẫn viên địa phương đón đoàn di chuyển về thành phố biển Pattaya. Trên đường ghé Đồi Vọng Cảnh ngắm toàn cảnh vịnh Pattaya. Tối: Thưởng thức bữa tối BBQ hải sản, dạo phố đi bộ Walking Street náo nhiệt.'),
('T006', 2, 'Đảo San Hô Coral – Trân Bảo Phật Sơn – Show Alcazar', 'Sáng: Đi cano cao tốc ra Đảo Coral cát trắng biển xanh. Quý khách tự do tắm biển hoặc tham gia dù lượn, lặn biển. Chiều: Chiêm bái Trân Bảo Phật Sơn (Khao Chee Chan) ngọn núi dát vàng 999 khắc hình tượng Phật Thích Ca bằng tia laser. Tối: Thưởng thức chương trình nghệ thuật Alcazar Cabaret Show đặc sắc của các nghệ sĩ chuyển giới.'),
('T006', 3, 'Pattaya – Vườn thực vật Nong Nooch – Bangkok', 'Sáng: Tham quan Công viên Nhiệt đới Nong Nooch chiêm ngưỡng show voi đá bóng, biểu diễn văn hóa Thái Lan. Trưa: Khởi hành về lại Bangkok, ghé Trung tâm Nghiên cứu Rắn Hoàng Gia và Trại ong. Tối: Tự do khám phá ẩm thực đường phố Bangkok tại chợ đêm Jodd Fairs.'),
('T006', 4, 'Chùa Thuyền Wat Yannawa – Dạo thuyền Sông Chao Phraya – IconSiam', 'Sáng: Dạo thuyền ngắm cảnh trên dòng sông Mẹ Chao Phraya huyền thoại, xem cá nổi. Viếng Chùa Thuyền Wat Yannawa và Chùa Phật Vàng Wat Traimit tượng Phật bằng vàng nguyên khối nặng 5.5 tấn. Chiều: Mua sắm thỏa thích tại đại siêu thị IconSiam bên bờ sông, xem nhạc nước ánh sáng nghệ thuật. Tối: Buffet quốc tế ngắm hoàng hôn tại Baiyoke Sky 86 tầng.'),
('T006', 5, 'Safari World – Mua sắm Pratunam – Bay về TP.HCM', 'Sáng: Tham quan Công viên hoang dã Safari World lớn nhất Đông Nam Á, xem show Cá Heo và Điệp viên 007 Hollywood. Chiều: Tự do mua sắm tại Central World, Big C Pratunam. Xe đưa đoàn ra sân bay Suvarnabhumi làm thủ tục bay về TP.HCM.');

-- T007: Singapore 4N3Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T007', 1, 'TP.HCM – Singapore – Công viên Sư Tử Biển Merlion – Marina Bay Sands', 'Sáng: Tập trung tại sân bay Tân Sơn Nhất đáp chuyến bay 5 sao Singapore Airlines SQ177 đi Singapore. Xe đón đoàn về trung tâm: chụp ảnh cùng biểu tượng Sư Tử Biển Merlion Park, ngắm Tòa nhà Quốc Hội và Nhà hát Trái Sầu Riêng Esplanade. Tối: Thưởng thức show nhạc nước Spectra Light & Water Show tại vịnh Marina Bay.'),
('T007', 2, 'Kỳ quan Gardens by the Bay – Flower Dome & Cloud Forest – Đảo Sentosa', 'Sáng: Khám phá Vườn sinh thái kỳ vĩ Gardens by the Bay: tham quan 2 nhà kính Flower Dome ngập tràn hoa ôn đới và Cloud Forest với thác nước nhân tạo trong nhà cao 35m. Chiều: Sang đảo giải trí Sentosa bằng cáp treo, check-in quả cầu xoay Universal Studios, tắm biển Siloso xinh đẹp.'),
('T007', 3, 'Chùa Răng Phật Chinatown – Phố nghệ thuật Haji Lane – Phố mua sắm Orchard Road', 'Sáng: Khám phá khu phố người Hoa Chinatown, viếng Chùa Răng Phật uy nghiêm chứa xá lợi thiêng. Dạo quanh khu phố Ả Rập Kampong Glam và Haji Lane ngập tràn tranh vẽ đường phố nghệ thuật độc đáo. Chiều: Tự do thỏa sức săn hàng hiệu giảm giá tại Đại lộ mua sắm Orchard Road. Tối: Thưởng thức món Cua sốt ớt Chilli Crab trứ danh.'),
('T007', 4, 'Khu phức hợp Jewel Changi – Thác nước Vortex – Bay về TP.HCM', 'Sáng: Trả phòng khách sạn, xe đưa đoàn sớm ra Sân bay Changi để khám phá Khu phức hợp Jewel Changi. Check-in thác nước nhân tạo cao nhất thế giới HSBC Rain Vortex đổ từ trần vòm kính cao 40m tuyệt mỹ. Làm thủ tục bay chuyến SQ186 về lại TP.HCM. Kết thúc hành trình Singapore tuyệt vời.');

-- T008: Bali 4N3Đ
INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES
('T008', 1, 'TP.HCM – Đảo Ngọc Bali – Đền Tanah Lot đón hoàng hôn', 'Sáng: Bay chuyến Vietjet Air thẳng đến Sân bay Ngurah Rai (DPS) Denpasar - Bali. Hướng dẫn viên bản địa đón đoàn với vòng hoa frangipani truyền thống. Chiều: Đến thăm Đền biển linh thiêng Tanah Lot ngự trị trên mỏm đá ngập tràn sóng biển đón hoàng hôn đỏ rực tuyệt đẹp. Tối: Nhận phòng resort tại Kuta/Seminyak.'),
('T008', 2, 'Cổng Trời Đền Lempuyang – Cung điện nước Tirta Gangga', 'Sáng: Khởi hành sớm đến Đền Lempuyang ngắm Cổng Trời hùng vĩ phản chiếu mây núi lửa Agung linh thiêng (bức ảnh check-in huyền thoại). Trưa: Dùng bữa trưa buffet phong cách Indonesia view núi rừng. Chiều: Dạo bước trên những bệ đá hoa sen giữa hồ cá koi tại Cung điện nước Hoàng gia Tirta Gangga.'),
('T008', 3, 'Thị trấn nghệ thuật Ubud – Xích đu Bali Swing – Ruộng bậc thang Tegalalang', 'Sáng: Đến Ubud - cái nôi văn hóa tâm linh của Bali. Trải nghiệm cảm giác bay bổng giữa rừng nhiệt đới với Bali Swing mạo hiểm, chụp ảnh cùng tổ chim lãng mạn. Chiêm ngưỡng Di sản Ruộng bậc thang xanh mướt Tegalalang. Chiều: Mua sắm đồ thủ công mỹ nghệ tại Chợ Nghệ thuật Ubud. Tối: Thưởng thức tiệc hải sản nướng bên bãi cát lung linh ánh nến tại Vịnh Jimbaran.'),
('T008', 4, 'Đền Uluwatu trên vách đá biển – Mua sắm Krishna – Về lại TP.HCM', 'Sáng: Khám phá Đền Uluwatu tọa lạc cheo leo trên vách đá hoa cương dựng đứng cao 70m hướng thẳng ra Ấn Độ Dương mênh mông. Tự do ghé siêu thị Krishna mua cà phê Chồn Kopi Luwak, xà phòng thảo mộc Bali. Trưa: Xe tiễn đoàn ra sân bay Denpasar làm thủ tục về lại TP.HCM.');
