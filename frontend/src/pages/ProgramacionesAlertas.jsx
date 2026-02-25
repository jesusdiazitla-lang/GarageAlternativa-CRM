// ============================================
// pages/Programaciones.jsx
// ============================================

import { useState, useEffect } from 'react';
import { programacionService, vehiculoService } from '../services';
import styles from './Clientes.module.css';

const Modal = ({ title, onClose, children }) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h3>{title}</h3>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const estadoBadge = (estado) => {
  const map = { pendiente: 'warning', completado: 'success', cancelado: 'danger' };
  return map[estado] || 'info';
};

export function Programaciones() {
  const [programaciones, setProgramaciones] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ tipo_mantenimiento: '', fecha_proxima: '', kilometraje_proximo: '', descripcion: '', id_vehiculo: '' });

  const fetch = async () => {
    setLoading(true);
    try { const r = await programacionService.getAll(); setProgramaciones(r.data.data); }
    catch { setError('Error al cargar.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetch();
    vehiculoService.getAll().then(r => setVehiculos(r.data.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await programacionService.create(form); setModal(false); fetch(); }
    catch (err) { setError(err.response?.data?.message || 'Error.'); }
    finally { setSaving(false); }
  };

  const handleEstado = async (id, estado) => {
    try { await programacionService.updateEstado(id, estado); fetch(); }
    catch (err) { setError(err.response?.data?.message || 'Error.'); }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', background: 'var(--gray-50)' };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Programaciones</h1>
          <p className={styles.subtitle}>Mantenimientos futuros programados</p>
        </div>
        <button className={styles.newBtn} onClick={() => setModal(true)}>+ Programar Servicio</button>
      </div>
      {error && <div className={styles.errorBanner} onClick={() => setError('')}>{error} ✕</div>}
      <div className={styles.card}>
        {loading ? <div className={styles.loading}><div className={styles.spinner} /></div>
        : programaciones.length === 0 ? (
          <div className={styles.empty}><span>📅</span><p>No hay servicios programados</p></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Vehículo</th><th>Cliente</th><th>Tipo</th><th>Fecha</th><th>Km</th><th>Estado</th><th>Acción</th></tr>
              </thead>
              <tbody>
                {programaciones.map(p => (
                  <tr key={p.id_programacion}>
                    <td><span style={{ fontFamily: 'var(--font-mono)', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>{p.placa}</span></td>
                    <td>{p.nombre_cliente}</td>
                    <td className={styles.nombre}>{p.tipo_mantenimiento}</td>
                    <td>{p.fecha_proxima ? new Date(p.fecha_proxima).toLocaleDateString('es-DO') : '—'}</td>
                    <td>{p.kilometraje_proximo ? `${p.kilometraje_proximo?.toLocaleString()} km` : '—'}</td>
                    <td><span className={`${styles.badge} ${styles[estadoBadge(p.estado)]}`}>{p.estado}</span></td>
                    <td>
                      {p.estado === 'pendiente' && (
                        <button style={{ background: 'var(--success-light)', color: 'var(--success)', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer' }}
                          onClick={() => handleEstado(p.id_programacion, 'completado')}>
                          ✓ Completar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title="Programar Servicio" onClose={() => setModal(false)}>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Vehículo *</label>
                <select value={form.id_vehiculo} onChange={e => setForm(f => ({ ...f, id_vehiculo: e.target.value }))} required style={inputStyle}>
                  <option value="">Seleccionar</option>
                  {vehiculos.map(v => <option key={v.id_vehiculo} value={v.id_vehiculo}>{v.placa} - {v.marca} {v.modelo}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Tipo de Mantenimiento *</label>
                <input value={form.tipo_mantenimiento} onChange={e => setForm(f => ({ ...f, tipo_mantenimiento: e.target.value }))} required placeholder="Cambio de aceite" style={inputStyle} />
              </div>
              <div className={styles.field}>
                <label>Fecha Próxima</label>
                <input type="date" value={form.fecha_proxima} onChange={e => setForm(f => ({ ...f, fecha_proxima: e.target.value }))} style={inputStyle} />
              </div>
              <div className={styles.field}>
                <label>Kilometraje Próximo</label>
                <input type="number" value={form.kilometraje_proximo} onChange={e => setForm(f => ({ ...f, kilometraje_proximo: e.target.value }))} placeholder="40000" style={inputStyle} />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={styles.submitBtn} disabled={saving}>{saving ? <span className={styles.spinner} /> : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// pages/Alertas.jsx
// ============================================

import { alertaService } from '../services';

export function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try { const r = await alertaService.getAll(); setAlertas(r.data.data); }
    catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const marcarLeida = async (id) => {
    try { await alertaService.marcarLeida(id); fetch(); }
    catch {}
  };

  const tipoBadge = (tipo) => ({ fecha: 'info', kilometraje: 'warning', ambos: 'danger' }[tipo] || 'info');
  const estadoBadge = (estado) => ({ pendiente: 'warning', enviada: 'info', leida: 'success' }[estado] || 'info');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Alertas</h1>
          <p className={styles.subtitle}>Notificaciones de mantenimiento</p>
        </div>
      </div>
      <div className={styles.card}>
        {loading ? <div className={styles.loading}><div className={styles.spinner} /></div>
        : alertas.length === 0 ? (
          <div className={styles.empty}><span>🔔</span><p>No hay alertas registradas</p></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Fecha</th><th>Vehículo</th><th>Cliente</th><th>Servicio</th><th>Tipo</th><th>Estado</th><th>Acción</th></tr>
              </thead>
              <tbody>
                {alertas.map(a => (
                  <tr key={a.id_alerta} style={{ opacity: a.estado === 'leida' ? 0.6 : 1 }}>
                    <td>{new Date(a.fecha_envio).toLocaleDateString('es-DO')}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>{a.placa}</span></td>
                    <td>{a.nombre_cliente}</td>
                    <td>{a.tipo_mantenimiento}</td>
                    <td><span className={`${styles.badge} ${styles[tipoBadge(a.tipo)]}`}>{a.tipo}</span></td>
                    <td><span className={`${styles.badge} ${styles[estadoBadge(a.estado)]}`}>{a.estado}</span></td>
                    <td>
                      {a.estado !== 'leida' && (
                        <button style={{ background: 'var(--success-light)', color: 'var(--success)', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer' }}
                          onClick={() => marcarLeida(a.id_alerta)}>
                          ✓ Leída
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}