// ============================================
// pages/Dashboard.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clienteService, vehiculoService, mantenimientoService, programacionService, alertaService } from '../services';
import styles from './Dashboard.module.css';

const StatCard = ({ icon, label, value, color, onClick }) => (
  <div className={styles.statCard} style={{ '--accent-color': color }} onClick={onClick}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statInfo}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  </div>
);

const getBadge = (dias) => {
  if (dias === null || dias === undefined) return null;
  if (dias < 0) return { label: 'Vencido', cls: 'danger' };
  if (dias === 0) return { label: 'Hoy', cls: 'danger' };
  if (dias <= 2) return { label: `${dias}d`, cls: 'warning' };
  return { label: `${dias}d`, cls: 'info' };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clientes: 0, vehiculos: 0, mantenimientos: 0, proximos: 0 });
  const [proximos, setProximos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, vehiculos, mantenimientos, proximosRes, alertasRes] = await Promise.all([
          clienteService.getAll(),
          vehiculoService.getAll(),
          mantenimientoService.getAll(),
          programacionService.getProximas(7),
          alertaService.getPendientes(),
        ]);
        setStats({
          clientes: clientes.data.total,
          vehiculos: vehiculos.data.total,
          mantenimientos: mantenimientos.data.total,
          proximos: alertasRes.data.total,
        });
        setProximos(proximosRes.data.data.slice(0, 5));
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Resumen general del sistema</p>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.actionBtn} onClick={() => navigate('/clientes')}>
            + Nuevo Cliente
          </button>
          <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={() => navigate('/vehiculos')}>
            + Vehículo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon="👥" label="Total Clientes"      value={stats.clientes}      color="#2563EB" onClick={() => navigate('/clientes')} />
        <StatCard icon="🚗" label="Total Vehículos"     value={stats.vehiculos}     color="#10B981" onClick={() => navigate('/vehiculos')} />
        <StatCard icon="🔧" label="Mantenimientos"      value={stats.mantenimientos} color="#F59E0B" onClick={() => navigate('/mantenimientos')} />
        <StatCard icon="🔔" label="Alertas Pendientes"  value={stats.proximos}      color="#EF4444" onClick={() => navigate('/alertas')} />
      </div>

      {/* Tabla de próximos */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Mantenimientos Próximos</h2>
          <button className={styles.linkBtn} onClick={() => navigate('/programaciones')}>
            Ver todos →
          </button>
        </div>

        {proximos.length === 0 ? (
          <div className={styles.empty}>
            <span>✅</span>
            <p>No hay mantenimientos próximos</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Vehículo</th>
                  <th>Tipo Servicio</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {proximos.map(p => {
                  const badge = getBadge(p.dias_restantes);
                  return (
                    <tr key={p.id_programacion}>
                      <td className={styles.clientName}>{p.nombre_cliente}</td>
                      <td>
                        <span className={styles.placa}>{p.placa}</span>
                        <span className={styles.vehicleInfo}>{p.marca} {p.modelo}</span>
                      </td>
                      <td>{p.tipo_mantenimiento}</td>
                      <td>{p.fecha_proxima ? new Date(p.fecha_proxima).toLocaleDateString('es-DO') : '—'}</td>
                      <td>
                        {badge && (
                          <span className={`${styles.badge} ${styles[badge.cls]}`}>
                            {badge.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}