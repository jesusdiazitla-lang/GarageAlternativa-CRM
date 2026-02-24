// ============================================
// cron.service.js - Tareas programadas
// ============================================

const cron = require('node-cron');
const AlertaModel = require('../models/alerta.model');

const iniciarCronJobs = () => {
  // Generar alertas automáticas todos los días a las 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ [CRON] Generando alertas automáticas...');
    try {
      await AlertaModel.generarAutomaticas();
      const total = await AlertaModel.contarPendientes();
      console.log(`✅ [CRON] Alertas generadas. Pendientes: ${total}`);
    } catch (error) {
      console.error('❌ [CRON] Error generando alertas:', error.message);
    }
  }, {
    timezone: 'America/Santo_Domingo'
  });

  console.log('✅ Cron jobs iniciados');
};

module.exports = { iniciarCronJobs };