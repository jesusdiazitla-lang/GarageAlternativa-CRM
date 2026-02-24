// ============================================
// alerta.controller.js
// ============================================

const AlertaModel = require('../models/alerta.model');

const AlertaController = {

  getAll: async (req, res) => {
    try {
      const alertas = await AlertaModel.getAll();
      res.json({ success: true, data: alertas, total: alertas.length });
    } catch (error) {
      console.error('Error getAll alertas:', error);
      res.status(500).json({ success: false, message: 'Error al obtener alertas.' });
    }
  },

  getPendientes: async (req, res) => {
    try {
      const [alertas, total] = await Promise.all([
        AlertaModel.getPendientes(),
        AlertaModel.contarPendientes()
      ]);
      res.json({ success: true, data: alertas, total });
    } catch (error) {
      console.error('Error getPendientes alertas:', error);
      res.status(500).json({ success: false, message: 'Error al obtener alertas pendientes.' });
    }
  },

  marcarLeida: async (req, res) => {
    try {
      const actualizado = await AlertaModel.marcarLeida(req.params.id);
      if (!actualizado) {
        return res.status(404).json({ success: false, message: 'Alerta no encontrada.' });
      }
      res.json({ success: true, message: 'Alerta marcada como leída.' });
    } catch (error) {
      console.error('Error marcarLeida:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar alerta.' });
    }
  },

  generarAutomaticas: async (req, res) => {
    try {
      await AlertaModel.generarAutomaticas();
      const total = await AlertaModel.contarPendientes();
      res.json({
        success: true,
        message: 'Alertas generadas correctamente.',
        data: { alertas_pendientes: total }
      });
    } catch (error) {
      console.error('Error generarAutomaticas:', error);
      res.status(500).json({ success: false, message: 'Error al generar alertas.' });
    }
  }
};

module.exports = AlertaController;