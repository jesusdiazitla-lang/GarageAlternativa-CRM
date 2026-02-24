// ============================================
// database.js - Configuración de MySQL
// ============================================

const mysql = require('mysql2/promise');

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'garage_alternativo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Función helper para queries
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Error en query:', error.message);
    throw error;
  }
};

// Exportar pool y función query
module.exports = {
  pool,
  query,
  getConnection: () => pool.getConnection(),
  end: () => pool.end()
};