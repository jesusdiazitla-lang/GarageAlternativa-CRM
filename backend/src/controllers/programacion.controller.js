// ============================================
// programacion.controller.js
// ============================================

const ProgramacionModel = require('../models/programacion.model');
const VehiculoModel = require('../models/vehiculo.model');

const ProgramacionController = {

  getAll: async (req, res) => {
    try {
      const programaciones = await ProgramacionModel.getAll();
      res.json({ success: true, data: programaciones, total: programaciones.length });
    } catch (error) {
      console.error('Error getAll programaciones:', error);
      res.status(500).json({ success: false, message: 'Error al obtener programaciones.' });
    }
  },

  getProximas: async (req, res) => {
    try {
      const dias = parseInt(req.query.dias) || 7;
      const proximas = await ProgramacionModel.getProximas(dias);
      res.json({ success: true, data: proximas, total: proximas.length });
    } catch (error) {
      console.error('Error getProximas:', error);
      res.status(500).json({ success: false, message: 'Error al obtener programaciones próximas.' });
    }
  },

  getById: async (req, res) => {
    try {
      const programacion = await ProgramacionModel.getById(req.params.id);
      if (!programacion) {
        return res.status(404).json({ success: false, message: 'Programación no encontrada.' });
      }
      res.json({ success: true, data: programacion });
    } catch (error) {
      console.error('Error getById programacion:', error);
      res.status(500).json({ success: false, message: 'Error al obtener programación.' });
    }
  },

  getByVehiculo: async (req, res) => {
    try {
      const programaciones = await ProgramacionModel.getByVehiculo(req.params.id_vehiculo);
      res.json({ success: true, data: programaciones, total: programaciones.length });
    } catch (error) {
      console.error('Error getByVehiculo programacion:', error);
      res.status(500).json({ success: false, message: 'Error al obtener programaciones.' });
    }
  },

  create: async (req, res) => {
    try {
      const { fecha_proxima, kilometraje_proximo, tipo_mantenimiento, descripcion, id_vehiculo } = req.body;

      if (!tipo_mantenimiento || !id_vehiculo) {
        return res.status(400).json({
          success: false,
          message: 'tipo_mantenimiento e id_vehiculo son requeridos.'
        });
      }

      if (!fecha_proxima && !kilometraje_proximo) {
        return res.status(400).json({
          success: false,
          message: 'Debe indicar al menos una fecha o kilometraje próximo.'
        });
      }

      const vehiculo = await VehiculoModel.getById(id_vehiculo);
      if (!vehiculo) {
        return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
      }

      const id = await ProgramacionModel.create({ fecha_proxima, kilometraje_proximo, tipo_mantenimiento, descripcion, id_vehiculo });
      const programacion = await ProgramacionModel.getById(id);

      res.status(201).json({
        success: true,
        message: 'Programación creada exitosamente.',
        data: programacion
      });
    } catch (error) {
      console.error('Error create programacion:', error);
      res.status(500).json({ success: false, message: 'Error al crear programación.' });
    }
  },

  update: async (req, res) => {
    try {
      const { fecha_proxima, kilometraje_proximo, tipo_mantenimiento, estado, descripcion } = req.body;

      if (!tipo_mantenimiento || !estado) {
        return res.status(400).json({
          success: false,
          message: 'tipo_mantenimiento y estado son requeridos.'
        });
      }

      const actualizado = await ProgramacionModel.update(req.params.id, {
        fecha_proxima, kilometraje_proximo, tipo_mantenimiento, estado, descripcion
      });

      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Programación no encontrada.' });
      }

      const programacion = await ProgramacionModel.getById(req.params.id);
      res.json({ success: true, message: 'Programación actualizada.', data: programacion });
    } catch (error) {
      console.error('Error update programacion:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar programación.' });
    }
  },

  updateEstado: async (req, res) => {
    try {
      const { estado } = req.body;
      const estadosValidos = ['pendiente', 'completado', 'cancelado'];

      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: `Estado inválido. Opciones: ${estadosValidos.join(', ')}`
        });
      }

      const actualizado = await ProgramacionModel.updateEstado(req.params.id, estado);
      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Programación no encontrada.' });
      }

      res.json({ success: true, message: `Estado actualizado a "${estado}".` });
    } catch (error) {
      console.error('Error updateEstado:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar estado.' });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await ProgramacionModel.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ success: false, message: 'Programación no encontrada.' });
      }
      res.json({ success: true, message: 'Programación eliminada correctamente.' });
    } catch (error) {
      console.error('Error delete programacion:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar programación.' });
    }
  }
};

module.exports = ProgramacionController;