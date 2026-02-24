// ============================================
// auth.controller.js
// ============================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

const AuthController = {

  login: async (req, res) => {
    try {
      const { email, contraseña } = req.body;

      if (!email || !contraseña) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos.'
        });
      }

      const usuario = await UsuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas.'
        });
      }

      const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!passwordValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas.'
        });
      }

      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      res.json({
        success: true,
        message: 'Login exitoso.',
        data: {
          token,
          usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
          }
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
  },

  register: async (req, res) => {
    try {
      const { nombre, email, contraseña, rol } = req.body;

      if (!nombre || !email || !contraseña) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son requeridos.'
        });
      }

      const existente = await UsuarioModel.findByEmail(email);
      if (existente) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un usuario con ese email.'
        });
      }

      const hash = await bcrypt.hash(contraseña, 10);
      const id = await UsuarioModel.create({ nombre, email, contraseña: hash, rol });

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente.',
        data: { id_usuario: id }
      });

    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
  },

  me: async (req, res) => {
    try {
      const usuario = await UsuarioModel.findById(req.usuario.id_usuario);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      }
      res.json({ success: true, data: usuario });
    } catch (error) {
      console.error('Error en me:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
  }
};

module.exports = AuthController;