// ============================================
// components/layout/Layout.jsx
// ============================================

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

const navItems = [
  { to: '/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/clientes',       icon: '👥', label: 'Clientes' },
  { to: '/vehiculos',      icon: '🚗', label: 'Vehículos' },
  { to: '/mantenimientos', icon: '🔧', label: 'Mantenimientos' },
  { to: '/programaciones', icon: '📅', label: 'Programaciones' },
  { to: '/alertas',        icon: '🔔', label: 'Alertas' },
];

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`${styles.wrapper} ${collapsed ? styles.collapsed : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🚗</span>
            {!collapsed && <span className={styles.logoText}>Garage</span>}
          </div>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>{usuario?.nombre}</span>
                <span className={styles.userRole}>{usuario?.rol}</span>
              </div>
            )}
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            🚪
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}