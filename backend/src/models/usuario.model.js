// ============================================
// usuario.model.js
// ============================================

const db = require('../config/database');

const UsuarioModel = {

  findByEmail: async (email) => {
    const results = await db.query(
      'SELECT id_usuario, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = ? AND activo = TRUE',
      [email]
    );
    return results[0] || null;
  },

  findById: async (id) => {
    const results = await db.query(
      'SELECT id_usuario, nombre, email, rol, fecha_creacion FROM usuarios WHERE id_usuario = ? AND activo = TRUE',
      [id]
    );
    return results[0] || null;
  },

  create: async ({ nombre, email, password_hash, rol = 'admin' }) => {
    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password_hash, rol]
    );
    return result.insertId;
  },

  getAll: async () => {
    return db.query(
      'SELECT id_usuario, nombre, email, rol, fecha_creacion, activo FROM usuarios ORDER BY fecha_creacion DESC'
    );
  },

  update: async (id, { nombre, email, rol }) => {
    const result = await db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?',
      [nombre, email, rol, id]
    );
    return result.affectedRows > 0;
  },

  deactivate: async (id) => {
    const result = await db.query(
      'UPDATE usuarios SET activo = FALSE WHERE id_usuario = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = UsuarioModel;