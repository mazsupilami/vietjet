-- ============================================================
-- VIETJET TRAVEL DEMO - SQLITE DATABASE SCHEMA
-- File: sqlite/01_schema.sql
-- Description: DDL schema for airlines, airports, flights,
--              fares, travel agencies, tours and itineraries.
-- ============================================================

PRAGMA foreign_keys = ON;

-- 1. Bảng Hãng hàng không (Airlines)
DROP TABLE IF EXISTS tour_itinerary;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS travel_agencies;
DROP TABLE IF EXISTS flight_fares;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS airlines;

CREATE TABLE airlines (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_color TEXT
);

-- 2. Bảng Sân bay (Airports)
CREATE TABLE airports (
  code TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL
);

-- 3. Bảng Chuyến bay (Flights)
CREATE TABLE flights (
  id TEXT PRIMARY KEY,
  airline_code TEXT NOT NULL REFERENCES airlines(code),
  flight_number TEXT NOT NULL,
  origin_code TEXT NOT NULL REFERENCES airports(code),
  destination_code TEXT NOT NULL REFERENCES airports(code),
  departure_at TEXT NOT NULL,
  arrival_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK(duration_minutes > 0),
  stops INTEGER NOT NULL DEFAULT 0 CHECK(stops >= 0),
  aircraft_model TEXT NOT NULL,
  checked_baggage_note TEXT,
  cabin_baggage_note TEXT,
  status TEXT NOT NULL DEFAULT 'available'
);

-- 4. Bảng Hạng vé & Giá chuyến bay (Flight Fares)
CREATE TABLE flight_fares (
  id TEXT PRIMARY KEY,
  flight_id TEXT NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  cabin TEXT NOT NULL CHECK(cabin IN ('economy','business')),
  price_vnd INTEGER NOT NULL CHECK(price_vnd >= 0),
  carry_on_kg INTEGER,
  checked_baggage_kg INTEGER,
  change_policy TEXT,
  refund_policy TEXT,
  UNIQUE(flight_id, cabin)
);

-- 5. Bảng Công ty Lữ hành (Travel Agencies)
CREATE TABLE travel_agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- 6. Bảng Tour du lịch (Tours)
CREATE TABLE tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  agency_id TEXT NOT NULL REFERENCES travel_agencies(id),
  airline_code TEXT REFERENCES airlines(code),
  origin_code TEXT REFERENCES airports(code),
  destination_code TEXT REFERENCES airports(code),
  departure_at TEXT,
  flight_duration_minutes INTEGER,
  aircraft_model TEXT,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  price_vnd INTEGER NOT NULL CHECK(price_vnd >= 0),
  image_url TEXT,
  included_services TEXT,
  excluded_services TEXT,
  cancellation_policy TEXT,
  featured INTEGER NOT NULL DEFAULT 0
);

-- 7. Bảng Lịch trình Tour từng ngày (Tour Itinerary)
CREATE TABLE tour_itinerary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tour_id TEXT NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  UNIQUE(tour_id, day_number)
);

-- Chỉ mục tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS idx_flights_route_departure ON flights(origin_code, destination_code, departure_at);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_code);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_flight_fares_flight_cabin ON flight_fares(flight_id, cabin);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);
CREATE INDEX IF NOT EXISTS idx_tours_airline ON tours(airline_code);
CREATE INDEX IF NOT EXISTS idx_tour_itinerary_tour ON tour_itinerary(tour_id, day_number);
