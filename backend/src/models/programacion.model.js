// ============================================
// programacion.model.js
// ============================================

const db = require('../config/database');

const ProgramacionModel = {

  getAll: async () => {
    return db.query(
      `SELECT p.*, v.placa, v.marca, v.modelo, v.kilometraje_actual,
              c.nombre AS nombre_cliente, c.telefono AS telefono_cliente,
              DATEDIFF(p.fecha_proxima, CURDATE()) AS dias_restantes,
              (p.kilometraje_proximo - v.kilometraje_actual) AS km_restantes
       FROM programaciones p
       INNER JOIN vehiculos v ON p.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       ORDER BY p.fecha_proxima ASC`
    );
  },

  getById: async (id) => {
    const results = await db.query(
      `SELECT p.*, v.placa, v.marca, v.modelo, v.kilometraje_actual,
              c.nombre AS nombre_cliente, c.telefono AS telefono_cliente
       FROM programaciones p
       INNER JOIN vehiculos v ON p.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE p.id_programacion = ?`,
      [id]
    );
    return results[0] || null;
  },

  getByVehiculo: async (id_vehiculo) => {
    return db.query(
      `SELECT * FROM programaciones
       WHERE id_vehiculo = ?
       ORDER BY fecha_proxima ASC`,
      [id_vehiculo]
    );
  },

  getProximas: async (dias = 7) => {
    return db.query(
      `SELECT p.*, v.placa, v.marca, v.modelo, v.kilometraje_actual,
              c.nombre AS nombre_cliente, c.telefono AS telefono_cliente,
              DATEDIFF(p.fecha_proxima, CURDATE()) AS dias_restantes,
              (p.kilometraje_proximo - v.kilometraje_actual) AS km_restantes
       FROM programaciones p
       INNER JOIN vehiculos v ON p.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE p.estado = 'pendiente'
         AND (
           p.fecha_proxima <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
           OR (p.kilometraje_proximo IS NOT NULL AND (p.kilometraje_proximo - v.kilometraje_actual) <= 500)
         )
       ORDER BY p.fecha_proxima ASC`,
      [dias]
    );
  },

  create: async ({ fecha_proxima, kilometraje_proximo, tipo_mantenimiento, descripcion, id_vehiculo }) => {
    const result = await db.query(
      `INSERT INTO programaciones
         (fecha_proxima, kilometraje_proximo, tipo_mantenimiento, descripcion, id_vehiculo)
       VALUES (?, ?, ?, ?, ?)`,
      [fecha_proxima || null, kilometraje_proximo || null, tipo_mantenimiento, descripcion || null, id_vehiculo]
    );
    return result.insertId;
  },

  update: async (id, { fecha_proxima, kilometraje_proximo, tipo_mantenimiento, estado, descripcion }) => {
    const result = await db.query(
      `UPDATE programaciones
       SET fecha_proxima = ?, kilometraje_proximo = ?, tipo_mantenimiento = ?, estado = ?, descripcion = ?
       WHERE id_programacion = ?`,
      [fecha_proxima || null, kilometraje_proximo || null, tipo_mantenimiento, estado, descripcion || null, id]
    );
    return result.affectedRows > 0;
  },

  updateEstado: async (id, estado) => {
    const result = await db.query(
      'UPDATE programaciones SET estado = ? WHERE id_programacion = ?',
      [estado, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await db.query(
      'DELETE FROM programaciones WHERE id_programacion = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = ProgramacionModel;