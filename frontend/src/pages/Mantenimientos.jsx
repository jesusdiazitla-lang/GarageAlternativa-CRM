// ============================================
// pages/Mantenimientos.jsx
// ============================================

import { useState, useEffect } from 'react';
import { mantenimientoService, vehiculoService } from '../services';
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

const MantenimientoForm = ({ inicial, vehiculos, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(inicial || {
    tipo_servicio: '', descripcion: '', fecha_realizacion: '', kilometraje: '', costo: '', observaciones: '', id_vehiculo: ''
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', background: 'var(--gray-50)' };

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Vehículo *</label>
          <select value={form.id_vehiculo} onChange={e => set('id_vehiculo', e.target.value)} required style={inputStyle}>
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map(v => <option key={v.id_vehiculo} value={v.id_vehiculo}>{v.placa} - {v.marca} {v.modelo}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Tipo de Servicio *</label>
          <input value={form.tipo_servicio} onChange={e => set('tipo_servicio', e.target.value)} required placeholder="Cambio de aceite" />
        </div>
        <div className={styles.field}>
          <label>Fecha *</label>
          <input type="date" value={form.fecha_realizacion} onChange={e => set('fecha_realizacion', e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label>Kilometraje *</label>
          <input type="number" value={form.kilometraje} onChange={e => set('kilometraje', e.target.value)} required placeholder="35000" min="0" />
        </div>
        <div className={styles.field}>
          <label>Costo (RD$)</label>
          <input type="number" value={form.costo} onChange={e => set('costo', e.target.value)} placeholder="2500" min="0" />
        </div>
        <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
          <label>Descripción</label>
          <input value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Descripción del servicio" />
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default function Mantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await mantenimientoService.getAll();
      setMantenimientos(res.data.data);
    } catch { setError('Error al cargar mantenimientos.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetch();
    vehiculoService.getAll().then(r => setVehiculos(r.data.data));
  }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try { await mantenimientoService.create(form); setModal(null); fetch(); }
    catch (err) { setError(err.response?.data?.message || 'Error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este mantenimiento?')) return;
    try { await mantenimientoService.delete(id); fetch(); }
    catch (err) { setError(err.response?.data?.message || 'Error al eliminar.'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mantenimientos</h1>
          <p className={styles.subtitle}>Historial de servicios realizados</p>
        </div>
        <button className={styles.newBtn} onClick={() => setModal('crear')}>+ Registrar Servicio</button>
      </div>
      {error && <div className={styles.errorBanner} onClick={() => setError('')}>{error} ✕</div>}
      <div className={styles.card}>
        {loading ? <div className={styles.loading}><div className={styles.spinner} /></div>
        : mantenimientos.length === 0 ? (
          <div className={styles.empty}><span>🔧</span><p>No hay mantenimientos registrados</p></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Fecha</th><th>Vehículo</th><th>Cliente</th><th>Servicio</th><th>Km</th><th>Costo</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {mantenimientos.map(m => (
                  <tr key={m.id_mantenimiento}>
                    <td>{new Date(m.fecha_realizacion).toLocaleDateString('es-DO')}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>{m.placa}</span></td>
                    <td>{m.nombre_cliente}</td>
                    <td className={styles.nombre}>{m.tipo_servicio}</td>
                    <td>{m.kilometraje?.toLocaleString()} km</td>
                    <td>{m.costo ? `RD$ ${Number(m.costo).toLocaleString()}` : '—'}</td>
                    <td><button className={styles.deleteBtn} onClick={() => handleDelete(m.id_mantenimiento)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal === 'crear' && (
        <Modal title="Registrar Mantenimiento" onClose={() => setModal(null)}>
          <MantenimientoForm vehiculos={vehiculos} onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} />
        </Modal>
      )}
    </div>
  );
}