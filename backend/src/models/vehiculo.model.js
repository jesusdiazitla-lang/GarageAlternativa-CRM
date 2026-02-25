// ============================================
// vehiculo.model.js
// ============================================

const db = require('../config/database');

const VehiculoModel = {

  getAll: async () => {
    return db.query(
      `SELECT v.id_vehiculo, v.marca, v.modelo, v.anio, v.placa,
              v.kilometraje_actual, v.activo,
              c.id_cliente, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente
       FROM vehiculos v
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE v.activo = TRUE
       ORDER BY v.marca, v.modelo`
    );
  },

  getById: async (id) => {
    const results = await db.query(
      `SELECT v.*, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente, c.email AS email_cliente
       FROM vehiculos v
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE v.id_vehiculo = ? AND v.activo = TRUE`,
      [id]
    );
    return results[0] || null;
  },

  getByCliente: async (id_cliente) => {
    return db.query(
      `SELECT id_vehiculo, marca, modelo, anio, placa, kilometraje_actual
       FROM vehiculos
       WHERE id_cliente = ? AND activo = TRUE
       ORDER BY anio DESC`,
      [id_cliente]
    );
  },

  getByPlaca: async (placa) => {
    const results = await db.query(
      'SELECT * FROM vehiculos WHERE placa = ? AND activo = TRUE',
      [placa]
    );
    return results[0] || null;
  },

  create: async ({ marca, modelo, anio, placa, kilometraje_actual, id_cliente }) => {
    const result = await db.query(
      `INSERT INTO vehiculos (marca, modelo, anio, placa, kilometraje_actual, id_cliente)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [marca, modelo, anio, placa.toUpperCase(), kilometraje_actual || 0, id_cliente]
    );
    return result.insertId;
  },

  update: async (id, { marca, modelo, anio, placa, kilometraje_actual }) => {
    const result = await db.query(
      `UPDATE vehiculos
       SET marca = ?, modelo = ?, anio = ?, placa = ?, kilometraje_actual = ?
       WHERE id_vehiculo = ? AND activo = TRUE`,
      [marca, modelo, anio, placa.toUpperCase(), kilometraje_actual, id]
    );
    return result.affectedRows > 0;
  },

  updateKilometraje: async (id, kilometraje) => {
    const result = await db.query(
      'UPDATE vehiculos SET kilometraje_actual = ? WHERE id_vehiculo = ? AND kilometraje_actual < ?',
      [kilometraje, id, kilometraje]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await db.query(
      'UPDATE vehiculos SET activo = FALSE WHERE id_vehiculo = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  search: async (termino) => {
    const like = `%${termino}%`;
    return db.query(
      `SELECT v.id_vehiculo, v.marca, v.modelo, v.anio, v.placa, v.kilometraje_actual,
              c.nombre AS nombre_cliente
       FROM vehiculos v
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE v.activo = TRUE
         AND (v.placa LIKE ? OR v.marca LIKE ? OR v.modelo LIKE ? OR c.nombre LIKE ?)
       ORDER BY v.marca`,
      [like, like, like, like]
    );
  }
};

module.exports = VehiculoModel;