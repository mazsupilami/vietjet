// ============================================================
// VIETJET TRAVEL - SQLITE (SQL.JS WASM) DATABASE CLIENT
// ============================================================

import { APP_CONFIG } from './config.js';

let dbInstance = null;
let initPromise = null;

/**
 * Khởi tạo và nạp database travel.sqlite vào bộ nhớ browser
 * @returns {Promise<any>} SQL.Database instance
 */
export async function getDatabase() {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (typeof window.initSqlJs !== 'function') {
        throw new Error('Thư viện sql.js chưa sẵn sàng hoặc không tải được CDN.');
      }

      const SQL = await window.initSqlJs({
        locateFile: file => `${APP_CONFIG.sqlJsWasmCdn}${file}`
      });

      const cacheBust = `?v=${Date.now()}`;
      let response = await fetch(APP_CONFIG.sqliteUrl + cacheBust);
      if (!response.ok && APP_CONFIG.fallbackSqliteUrl) {
        console.warn(`Không tải được ${APP_CONFIG.sqliteUrl}, chuyển sang fallback ${APP_CONFIG.fallbackSqliteUrl}`);
        response = await fetch(APP_CONFIG.fallbackSqliteUrl + cacheBust);
      }
      if (!response.ok) {
        throw new Error(`Không tải được tệp SQLite snapshot: HTTP ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      dbInstance = new SQL.Database(new Uint8Array(buffer));
      console.log('✅ SQLite Database đã tải thành công vào bộ nhớ WebAssembly.');
      return dbInstance;
    } catch (err) {
      console.error('❌ Lỗi khởi tạo SQLite DB:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Thực thi câu truy vấn SELECT có tham số và trả về mảng object [{col: val, ...}]
 * @param {string} sql 
 * @param {Array<any>} params 
 * @returns {Promise<Array<Object>>}
 */
export async function queryAll(sql, params = []) {
  const db = await getDatabase();
  const stmt = db.prepare(sql);
  try {
    if (params && params.length > 0) {
      stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    return results;
  } finally {
    stmt.free();
  }
}

/**
 * Thực thi câu truy vấn SELECT có tham số và trả về 1 dòng object hoặc null
 * @param {string} sql 
 * @param {Array<any>} params 
 * @returns {Promise<Object|null>}
 */
export async function queryOne(sql, params = []) {
  const list = await queryAll(sql, params);
  return list.length > 0 ? list[0] : null;
}
