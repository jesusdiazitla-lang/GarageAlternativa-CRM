// ============================================
// alerta.model.js
// ============================================

const db = require('../config/database');

const AlertaModel = {

  getAll: async () => {
    return db.query(
      `SELECT a.*, p.tipo_mantenimiento, v.placa, v.marca, v.modelo,
              c.nombre AS nombre_cliente, c.telefono AS telefono_cliente
       FROM alertas a
       INNER JOIN programaciones p ON a.id_programacion = p.id_programacion
       INNER JOIN vehiculos v ON p.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       ORDER BY a.fecha_envio DESC`
    );
  },

  getPendientes: async () => {
    return db.query(
      `SELECT a.*, p.tipo_mantenimiento, v.placa, v.marca, v.modelo,
              c.nombre AS nombre_cliente, c.telefono AS telefono_cliente
       FROM alertas a
       INNER JOIN programaciones p ON a.id_programacion = p.id_programacion
       INNER JOIN vehiculos v ON p.id_vehiculo = v.id_vehiculo
       INNER JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE a.estado = 'pendiente'
       ORDER BY a.fecha_envio ASC`
    );
  },

  getById: async (id) => {
    const results = await db.query(
      'SELECT * FROM alertas WHERE id_alerta = ?',
      [id]
    );
    return results[0] || null;
  },

  marcarLeida: async (id) => {
    const result = await db.query(
      "UPDATE alertas SET estado = 'leida' WHERE id_alerta = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  marcarEnviada: async (id) => {
    const result = await db.query(
      "UPDATE alertas SET estado = 'enviada' WHERE id_alerta = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  generarAutomaticas: async () => {
    // Llama al stored procedure del schema
    return db.query('CALL generar_alertas_automaticas()');
  },

  contarPendientes: async () => {
    const results = await db.query(
      "SELECT COUNT(*) AS total FROM alertas WHERE estado = 'pendiente'"
    );
    return results[0].total;
  }
};

module.exports = AlertaModel;