// ============================================
// vehiculo.controller.js
// ============================================

const VehiculoModel = require('../models/vehiculo.model');
const ClienteModel = require('../models/cliente.model');

const VehiculoController = {

  getAll: async (req, res) => {
    try {
      const { buscar } = req.query;
      const vehiculos = buscar
        ? await VehiculoModel.search(buscar)
        : await VehiculoModel.getAll();

      res.json({ success: true, data: vehiculos, total: vehiculos.length });
    } catch (error) {
      console.error('Error getAll vehiculos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener vehículos.' });
    }
  },

  getById: async (req, res) => {
    try {
      const vehiculo = await VehiculoModel.getById(req.params.id);
      if (!vehiculo) {
        return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
      }
      res.json({ success: true, data: vehiculo });
    } catch (error) {
      console.error('Error getById vehiculo:', error);
      res.status(500).json({ success: false, message: 'Error al obtener vehículo.' });
    }
  },

  create: async (req, res) => {
    try {
      const { marca, modelo, año, placa, kilometraje_actual, id_cliente } = req.body;

      if (!marca || !modelo || !año || !placa || !id_cliente) {
        return res.status(400).json({
          success: false,
          message: 'Marca, modelo, año, placa e id_cliente son requeridos.'
        });
      }

      // Verificar que el cliente existe
      const cliente = await ClienteModel.getById(id_cliente);
      if (!cliente) {
        return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
      }

      // Verificar placa única
      const placaExistente = await VehiculoModel.getByPlaca(placa);
      if (placaExistente) {
        return res.status(409).json({
          success: false,
          message: `Ya existe un vehículo con la placa ${placa.toUpperCase()}.`
        });
      }

      const id = await VehiculoModel.create({ marca, modelo, año, placa, kilometraje_actual, id_cliente });
      const vehiculo = await VehiculoModel.getById(id);

      res.status(201).json({
        success: true,
        message: 'Vehículo registrado exitosamente.',
        data: vehiculo
      });
    } catch (error) {
      console.error('Error create vehiculo:', error);
      res.status(500).json({ success: false, message: 'Error al registrar vehículo.' });
    }
  },

  update: async (req, res) => {
    try {
      const { marca, modelo, año, placa, kilometraje_actual } = req.body;

      if (!marca || !modelo || !año || !placa) {
        return res.status(400).json({
          success: false,
          message: 'Marca, modelo, año y placa son requeridos.'
        });
      }

      // Verificar placa única (excluyendo el vehículo actual)
      const placaExistente = await VehiculoModel.getByPlaca(placa);
      if (placaExistente && placaExistente.id_vehiculo != req.params.id) {
        return res.status(409).json({
          success: false,
          message: `La placa ${placa.toUpperCase()} ya está registrada en otro vehículo.`
        });
      }

      const actualizado = await VehiculoModel.update(req.params.id, { marca, modelo, año, placa, kilometraje_actual });
      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
      }

      const vehiculo = await VehiculoModel.getById(req.params.id);
      res.json({ success: true, message: 'Vehículo actualizado.', data: vehiculo });
    } catch (error) {
      console.error('Error update vehiculo:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar vehículo.' });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await VehiculoModel.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ success: false, message: 'Vehículo no encontrado.' });
      }
      res.json({ success: true, message: 'Vehículo eliminado correctamente.' });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          success: false,
          message: 'No se puede eliminar: el vehículo tiene mantenimientos registrados.'
        });
      }
      console.error('Error delete vehiculo:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar vehículo.' });
    }
  }
};

module.exports = VehiculoController;