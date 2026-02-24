// ============================================
// app.js - Configuración de Express
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();

// ===== MIDDLEWARE =====

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===== RUTAS =====

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Garage Alternativo - Funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth:           '/api/auth',
      clientes:       '/api/clientes',
      vehiculos:      '/api/vehiculos',
      mantenimientos: '/api/mantenimientos',
      programaciones: '/api/programaciones',
      alertas:        '/api/alertas'
    }
  });
});

app.use('/api/auth',           require('./routes/auth.routes'));
app.use('/api/clientes',       require('./routes/cliente.routes'));
app.use('/api/vehiculos',      require('./routes/vehiculo.routes'));
app.use('/api/mantenimientos', require('./routes/mantenimiento.routes'));
app.use('/api/programaciones', require('./routes/programacion.routes'));
app.use('/api/alertas',        require('./routes/alerta.routes'));

// ===== MANEJO DE ERRORES =====

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;