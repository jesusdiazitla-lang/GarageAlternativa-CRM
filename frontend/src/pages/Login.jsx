// ============================================
// pages/Login.jsx
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, contrasena);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Panel izquierdo */}
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <div className={styles.carIcon}>🚗</div>
          <h1 className={styles.brand}>Garage Alternativo</h1>
          <p className={styles.brandDesc}>
            Sistema de gestión de mantenimiento vehicular a domicilio.
            Control total de tus clientes y servicios.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}><span>500+</span><p>Clientes</p></div>
            <div className={styles.stat}><span>1.2k</span><p>Servicios</p></div>
            <div className={styles.stat}><span>98%</span><p>Satisfacción</p></div>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Correo Electrónico</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@garage.com"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Contraseña</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}