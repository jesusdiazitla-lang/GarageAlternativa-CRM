// ============================================
// pages/Vehiculos.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vehiculoService, clienteService } from '../services';
import styles from './Clientes.module.css'; // reutiliza estilos

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

const VehiculoForm = ({ inicial, clientes, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(inicial || { marca: '', modelo: '', anio: '', placa: '', kilometraje_actual: 0, id_cliente: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Cliente *</label>
          <select value={form.id_cliente} onChange={e => set('id_cliente', e.target.value)} required style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', background: 'var(--gray-50)' }}>
            <option value="">Seleccionar cliente</option>
            {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Placa *</label>
          <input value={form.placa} onChange={e => set('placa', e.target.value.toUpperCase())} required placeholder="A123456" />
        </div>
        <div className={styles.field}>
          <label>Marca *</label>
          <input value={form.marca} onChange={e => set('marca', e.target.value)} required placeholder="Toyota" />
        </div>
        <div className={styles.field}>
          <label>Modelo *</label>
          <input value={form.modelo} onChange={e => set('modelo', e.target.value)} required placeholder="Corolla" />
        </div>
        <div className={styles.field}>
          <label>Año *</label>
          <input type="number" value={form.anio} onChange={e => set('anio', e.target.value)} required placeholder="2020" min="1900" max="2026" />
        </div>
        <div className={styles.field}>
          <label>Kilometraje</label>
          <input type="number" value={form.kilometraje_actual} onChange={e => set('kilometraje_actual', e.target.value)} placeholder="35000" min="0" />
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

export default function Vehiculos() {
  const [searchParams] = useSearchParams();
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buscar, setBuscar] = useState('');
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const fetchVehiculos = async (q = '') => {
    setLoading(true);
    try {
      const res = await vehiculoService.getAll(q);
      setVehiculos(res.data.data);
    } catch { setError('Error al cargar vehículos.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchVehiculos();
    clienteService.getAll().then(r => setClientes(r.data.data));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchVehiculos(buscar), 350);
    return () => clearTimeout(t);
  }, [buscar]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await vehiculoService.create(form);
      setModal(null);
      fetchVehiculos();
    } catch (err) { setError(err.response?.data?.message || 'Error al crear.'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await vehiculoService.update(modal.vehiculo.id_vehiculo, form);
      setModal(null);
      fetchVehiculos();
    } catch (err) { setError(err.response?.data?.message || 'Error al actualizar.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vehículo?')) return;
    try {
      await vehiculoService.delete(id);
      fetchVehiculos();
    } catch (err) { setError(err.response?.data?.message || 'Error al eliminar.'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vehículos</h1>
          <p className={styles.subtitle}>Gestiona los vehículos registrados</p>
        </div>
        <button className={styles.newBtn} onClick={() => setModal('crear')}>+ Nuevo Vehículo</button>
      </div>

      {error && <div className={styles.errorBanner} onClick={() => setError('')}>{error} ✕</div>}

      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar por placa, marca, modelo o cliente..." />
      </div>

      <div className={styles.card}>
        {loading ? <div className={styles.loading}><div className={styles.spinner} /></div>
        : vehiculos.length === 0 ? (
          <div className={styles.empty}>
            <span>🚗</span>
            <p>{buscar ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Vehículo</th>
                  <th>Año</th>
                  <th>Kilometraje</th>
                  <th>Cliente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map(v => (
                  <tr key={v.id_vehiculo}>
                    <td><span style={{ fontFamily: 'var(--font-mono)', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{v.placa}</span></td>
                    <td className={styles.nombre}>{v.marca} {v.modelo}</td>
                    <td>{v.anio}</td>
                    <td>{v.kilometraje_actual?.toLocaleString()} km</td>
                    <td>{v.nombre_cliente}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => setModal({ vehiculo: v })}>✏️</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(v.id_vehiculo)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === 'crear' && (
        <Modal title="Nuevo Vehículo" onClose={() => setModal(null)}>
          <VehiculoForm clientes={clientes} onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal?.vehiculo && (
        <Modal title="Editar Vehículo" onClose={() => setModal(null)}>
          <VehiculoForm inicial={modal.vehiculo} clientes={clientes} onSubmit={handleUpdate} onClose={() => setModal(null)} loading={saving} />
        </Modal>
      )}
    </div>
  );
}