// ============================================
// mantenimiento.controller.js
// ============================================

const MantenimientoModel = require('../models/mantenimiento.model');
const VehiculoModel = require('../models/vehiculo.model');

const MantenimientoController = {

  getAll: async (req, res) => {
    try {
      const mantenimientos = await MantenimientoModel.getAll();
      res.json({ success: true, data: mantenimientos, total: mantenimientos.length });
    } catch (error) {
      console.error('Error getAll mantenimientos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener mantenimientos.' });
    }
  },

  getById: async (req, res) => {
    try {
      const mantenimiento = await MantenimientoModel.getById(req.params.id);
      if (!mantenimiento) {
        return res.status(404).json({ success: false, message: 'Mantenimiento no encontrado.' });
      }
      res.json({ success: true, data: mantenimiento });
    } catch (error) {
      console.error('Error getById mantenimiento:', error);
      res.status(500).json({ success: false, message: 'Error al obtener mantenimiento.' });
    }
  },

  getByVehiculo: async (req, res) => {
    try {
      const vehiculo = await VehiculoModel.getById(req.params.id_vehiculo);
      if (!vehiculo) {
        return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
      }

      const [historial, resumen] = await Promise.all([
        MantenimientoModel.getByVehiculo(req.params.id_vehiculo),
        MantenimientoModel.getResumenByVehiculo(req.params.id_vehiculo)
      ]);

      res.json({
        success: true,
        data: { vehiculo, resumen, historial }
      });
    } catch (error) {
      console.error('Error getByVehiculo:', error);
      res.status(500).json({ success: false, message: 'Error al obtener historial.' });
    }
  },

  create: async (req, res) => {
    try {
      const { tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones, id_vehiculo } = req.body;

      if (!tipo_servicio || !fecha_realizacion || !kilometraje || !id_vehiculo) {
        return res.status(400).json({
          success: false,
          message: 'tipo_servicio, fecha_realizacion, kilometraje e id_vehiculo son requeridos.'
        });
      }

      // Verificar que el vehículo existe
      const vehiculo = await VehiculoModel.getById(id_vehiculo);
      if (!vehiculo) {
        return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
      }

      const id = await MantenimientoModel.create({
        tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones, id_vehiculo
      });

      const mantenimiento = await MantenimientoModel.getById(id);

      res.status(201).json({
        success: true,
        message: 'Mantenimiento registrado exitosamente.',
        data: mantenimiento
      });
    } catch (error) {
      console.error('Error create mantenimiento:', error);
      res.status(500).json({ success: false, message: 'Error al registrar mantenimiento.' });
    }
  },

  update: async (req, res) => {
    try {
      const { tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones } = req.body;

      if (!tipo_servicio || !fecha_realizacion || !kilometraje) {
        return res.status(400).json({
          success: false,
          message: 'tipo_servicio, fecha_realizacion y kilometraje son requeridos.'
        });
      }

      const actualizado = await MantenimientoModel.update(req.params.id, {
        tipo_servicio, descripcion, fecha_realizacion, kilometraje, costo, observaciones
      });

      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Mantenimiento no encontrado.' });
      }

      const mantenimiento = await MantenimientoModel.getById(req.params.id);
      res.json({ success: true, message: 'Mantenimiento actualizado.', data: mantenimiento });
    } catch (error) {
      console.error('Error update mantenimiento:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar mantenimiento.' });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await MantenimientoModel.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ success: false, message: 'Mantenimiento no encontrado.' });
      }
      res.json({ success: true, message: 'Mantenimiento eliminado correctamente.' });
    } catch (error) {
      console.error('Error delete mantenimiento:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar mantenimiento.' });
    }
  }
};

module.exports = MantenimientoController;