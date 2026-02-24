// ============================================
// mantenimiento.model.js
// ============================================

const db = require('../config/database');

const MantenimientoModel = {

  getAll: async () => {
    return db.query(
      `SELECT m.*, v.placa, v.marca, v.modelo, c.nombre AS nombre_cliente
       FROM mantenimientos m
       INNER JOIN vehiculos v ON m.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       ORDER BY m.fecha_realizacion DESC`
    );
  },

  getById: async (id) => {
    const results = await db.query(
      `SELECT m.*, v.placa, v.marca, v.modelo, c.nombre AS nombre_cliente, c.telefono AS telefono_cliente
       FROM mantenimientos m
       INNER JOIN vehiculos v ON m.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE m.id_mantenimiento = ?`,
      [id]
    );
    return results[0] || null;
  },

  getByVehiculo: async (id_vehiculo) => {
    return db.query(
      `SELECT * FROM mantenimientos
       WHERE id_vehiculo = ?
       ORDER BY fecha_realizacion DESC`,
      [id_vehiculo]
    );
  },

  create: async ({ tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones, id_vehiculo }) => {
    const result = await db.query(
      `INSERT INTO mantenimientos
         (tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones, id_vehiculo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tipo_servicio, descripcion || null, fecha_realizacion, kilometraje, costo || null, observaciones || null, id_vehiculo]
    );
    return result.insertId;
  },

  update: async (id, { tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones }) => {
    const result = await db.query(
      `UPDATE mantenimientos
       SET tipo_servicio = ?, descripcion = ?, fecha_realizacion = ?,
           kilometraje = ?, costo = ?, observaciones = ?
       WHERE id_mantenimiento = ?`,
      [tipo_servicio, descripcion || null, fecha_realizacion, kilometraje, costo || null, observaciones || null, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await db.query(
      'DELETE FROM mantenimientos WHERE id_mantenimiento = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  getResumenByVehiculo: async (id_vehiculo) => {
    const results = await db.query(
      `SELECT
         COUNT(*) AS total_servicios,
         SUM(costo) AS costo_total,
         MAX(fecha_realizacion) AS ultimo_servicio,
         MAX(kilometraje) AS ultimo_kilometraje
       FROM mantenimientos
       WHERE id_vehiculo = ?`,
      [id_vehiculo]
    );
    return results[0];
  }
};

module.exports = MantenimientoModel;