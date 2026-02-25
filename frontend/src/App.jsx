// ============================================
// App.jsx - Rutas principales
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import Mantenimientos from './pages/Mantenimientos';
import { Programaciones, Alertas } from './pages/ProgramacionesAlertas';
import './styles/globals.css';

// Ruta protegida
const PrivateRoute = ({ children }) => {
  const { usuario, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
  return usuario ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route path="/" element={
        <PrivateRoute><Layout /></PrivateRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"      element={<Dashboard />} />
        <Route path="clientes"       element={<Clientes />} />
        <Route path="vehiculos"      element={<Vehiculos />} />
        <Route path="mantenimientos" element={<Mantenimientos />} />
        <Route path="programaciones" element={<Programaciones />} />
        <Route path="alertas"        element={<Alertas />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}