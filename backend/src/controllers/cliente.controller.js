// ============================================
// cliente.controller.js
// ============================================

const ClienteModel = require('../models/cliente.model');

const ClienteController = {

  getAll: async (req, res) => {
    try {
      const { buscar } = req.query;
      const clientes = buscar
        ? await ClienteModel.search(buscar)
        : await ClienteModel.getAll();

      res.json({ success: true, data: clientes, total: clientes.length });
    } catch (error) {
      console.error('Error getAll clientes:', error);
      res.status(500).json({ success: false, message: 'Error al obtener clientes.' });
    }
  },

  getById: async (req, res) => {
    try {
      const cliente = await ClienteModel.getWithVehiculos(req.params.id);
      if (!cliente) {
        return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
      }
      res.json({ success: true, data: cliente });
    } catch (error) {
      console.error('Error getById cliente:', error);
      res.status(500).json({ success: false, message: 'Error al obtener cliente.' });
    }
  },

  create: async (req, res) => {
    try {
      const { nombre, telefono, direccion, email } = req.body;

      if (!nombre || !telefono) {
        return res.status(400).json({
          success: false,
          message: 'Nombre y teléfono son requeridos.'
        });
      }

      const id = await ClienteModel.create({ nombre, telefono, direccion, email });
      const cliente = await ClienteModel.getById(id);

      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente.',
        data: cliente
      });
    } catch (error) {
      console.error('Error create cliente:', error);
      res.status(500).json({ success: false, message: 'Error al crear cliente.' });
    }
  },

  update: async (req, res) => {
    try {
      const { nombre, telefono, direccion, email } = req.body;

      if (!nombre || !telefono) {
        return res.status(400).json({
          success: false,
          message: 'Nombre y teléfono son requeridos.'
        });
      }

      const actualizado = await ClienteModel.update(req.params.id, { nombre, telefono, direccion, email });
      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
      }

      const cliente = await ClienteModel.getById(req.params.id);
      res.json({ success: true, message: 'Cliente actualizado.', data: cliente });
    } catch (error) {
      console.error('Error update cliente:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar cliente.' });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await ClienteModel.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
      }
      res.json({ success: true, message: 'Cliente eliminado correctamente.' });
    } catch (error) {
      // FK constraint: cliente tiene vehículos
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          success: false,
          message: 'No se puede eliminar: el cliente tiene vehículos registrados.'
        });
      }
      console.error('Error delete cliente:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar cliente.' });
    }
  }
};

module.exports = ClienteController;