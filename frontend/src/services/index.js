// ============================================
// services/auth.service.js
// ============================================
import api from './api';

export const authService = {
  login: (email, contrasena) => api.post('/auth/login', { email, contrasena }),
  me: () => api.get('/auth/me'),
};

// ============================================
// services/cliente.service.js
// ============================================
export const clienteService = {
  getAll: (buscar) => api.get('/clientes', { params: buscar ? { buscar } : {} }),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

// ============================================
// services/vehiculo.service.js
// ============================================
export const vehiculoService = {
  getAll: (buscar) => api.get('/vehiculos', { params: buscar ? { buscar } : {} }),
  getById: (id) => api.get(`/vehiculos/${id}`),
  create: (data) => api.post('/vehiculos', data),
  update: (id, data) => api.put(`/vehiculos/${id}`, data),
  delete: (id) => api.delete(`/vehiculos/${id}`),
};

// ============================================
// services/mantenimiento.service.js
// ============================================
export const mantenimientoService = {
  getAll: () => api.get('/mantenimientos'),
  getByVehiculo: (id) => api.get(`/mantenimientos/vehiculo/${id}`),
  create: (data) => api.post('/mantenimientos', data),
  update: (id, data) => api.put(`/mantenimientos/${id}`, data),
  delete: (id) => api.delete(`/mantenimientos/${id}`),
};

// ============================================
// services/programacion.service.js
// ============================================
export const programacionService = {
  getAll: () => api.get('/programaciones'),
  getProximas: (dias = 7) => api.get('/programaciones/proximas', { params: { dias } }),
  create: (data) => api.post('/programaciones', data),
  update: (id, data) => api.put(`/programaciones/${id}`, data),
  updateEstado: (id, estado) => api.patch(`/programaciones/${id}/estado`, { estado }),
  delete: (id) => api.delete(`/programaciones/${id}`),
};

// ============================================
// services/alerta.service.js
// ============================================
export const alertaService = {
  getAll: () => api.get('/alertas'),
  getPendientes: () => api.get('/alertas/pendientes'),
  marcarLeida: (id) => api.patch(`/alertas/${id}/leer`),
};