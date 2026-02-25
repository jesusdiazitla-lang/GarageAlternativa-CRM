// ============================================
// server.js - Punto de entrada del servidor
// ============================================

require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');
const { iniciarCronJobs } = require('./src/services/cron.service');

const PORT = process.env.PORT || 3000;

db.getConnection()
  .then(connection => {
    console.log('✅ Base de datos conectada correctamente');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Servidor iniciado: ${new Date().toLocaleString()}`);
    });

    // Iniciar tareas programadas
    iniciarCronJobs();
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    console.error('🔧 Verifica tu archivo .env y que MySQL esté corriendo');
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  db.end();
  process.exit(0);
});