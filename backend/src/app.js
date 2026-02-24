// ============================================
// app.js - Configuración de Express
// ============================================

const express = require('express');
const cors = require('cors');

const app = express();

// ===== MIDDLEWARE =====

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===== RUTAS =====

// Ruta de health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Garage Alternativo - Funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);

// ===== MANEJO DE ERRORES =====

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;