// ============================================
// cliente.model.js
// ============================================

const db = require('../config/database');

const ClienteModel = {

  getAll: async () => {
    return db.query(
      `SELECT id_cliente, nombre, telefono, direccion, email, fecha_registro, activo
       FROM clientes
       ORDER BY nombre ASC`
    );
  },

  getById: async (id) => {
    const results = await db.query(
      'SELECT * FROM clientes WHERE id_cliente = ? AND activo = TRUE',
      [id]
    );
    return results[0] || null;
  },

  getWithVehiculos: async (id) => {
    const cliente = await ClienteModel.getById(id);
    if (!cliente) return null;

    const vehiculos = await db.query(
      `SELECT id_vehiculo, marca, modelo, año, placa, kilometraje_actual, activo
       FROM vehiculos
       WHERE id_cliente = ? AND activo = TRUE`,
      [id]
    );

    return { ...cliente, vehiculos };
  },

  create: async ({ nombre, telefono, direccion, email }) => {
    const result = await db.query(
      'INSERT INTO clientes (nombre, telefono, direccion, email) VALUES (?, ?, ?, ?)',
      [nombre, telefono, direccion || null, email || null]
    );
    return result.insertId;
  },

  update: async (id, { nombre, telefono, direccion, email }) => {
    const result = await db.query(
      `UPDATE clientes
       SET nombre = ?, telefono = ?, direccion = ?, email = ?
       WHERE id_cliente = ? AND activo = TRUE`,
      [nombre, telefono, direccion || null, email || null, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await db.query(
      'UPDATE clientes SET activo = FALSE WHERE id_cliente = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  search: async (termino) => {
    const like = `%${termino}%`;
    return db.query(
      `SELECT id_cliente, nombre, telefono, email
       FROM clientes
       WHERE activo = TRUE AND (nombre LIKE ? OR telefono LIKE ? OR email LIKE ?)
       ORDER BY nombre ASC`,
      [like, like, like]
    );
  }
};

module.exports = ClienteModel;