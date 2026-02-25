// ============================================
// pages/Clientes.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../services';
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

const ClienteForm = ({ inicial, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(inicial || { nombre: '', telefono: '', email: '', direccion: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Nombre *</label>
          <input value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Juan Pérez" />
        </div>
        <div className={styles.field}>
          <label>Teléfono *</label>
          <input value={form.telefono} onChange={e => set('telefono', e.target.value)} required placeholder="809-555-1234" />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="correo@email.com" />
        </div>
        <div className={styles.field}>
          <label>Dirección</label>
          <input value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Av. Principal #123" />
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

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buscar, setBuscar] = useState('');
  const [modal, setModal] = useState(null); // 'crear' | { cliente }
  const [error, setError] = useState('');

  const fetchClientes = async (q = '') => {
    setLoading(true);
    try {
      const res = await clienteService.getAll(q);
      setClientes(res.data.data);
    } catch { setError('Error al cargar clientes.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClientes(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchClientes(buscar), 350);
    return () => clearTimeout(t);
  }, [buscar]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await clienteService.create(form);
      setModal(null);
      fetchClientes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear cliente.');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await clienteService.update(modal.cliente.id_cliente, form);
      setModal(null);
      fetchClientes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await clienteService.delete(id);
      fetchClientes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Clientes</h1>
          <p className={styles.subtitle}>Administra la información de tus clientes</p>
        </div>
        <button className={styles.newBtn} onClick={() => setModal('crear')}>
          + Nuevo Cliente
        </button>
      </div>

      {error && <div className={styles.errorBanner} onClick={() => setError('')}>{error} ✕</div>}

      {/* Buscador */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
        />
        {buscar && <button className={styles.clearBtn} onClick={() => setBuscar('')}>✕</button>}
      </div>

      {/* Tabla */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}><div className={styles.spinner} /></div>
        ) : clientes.length === 0 ? (
          <div className={styles.empty}>
            <span>👥</span>
            <p>{buscar ? 'No se encontraron resultados' : 'No hay clientes registrados'}</p>
            {!buscar && <button className={styles.newBtn} onClick={() => setModal('crear')}>Registrar primer cliente</button>}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Dirección</th>
                  <th>Vehículos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c, i) => (
                  <tr key={c.id_cliente}>
                    <td className={styles.idx}>{String(i + 1).padStart(3, '0')}</td>
                    <td className={styles.nombre}>{c.nombre}</td>
                    <td>{c.telefono}</td>
                    <td className={styles.email}>{c.email || '—'}</td>
                    <td className={styles.dir}>{c.direccion || '—'}</td>
                    <td>
                      <button
                        className={styles.vehiculosBtn}
                        onClick={() => navigate(`/vehiculos?cliente=${c.id_cliente}`)}
                      >
                        🚗 Ver
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => setModal({ cliente: c })} title="Editar">✏️</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(c.id_cliente)} title="Eliminar">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {modal === 'crear' && (
        <Modal title="Nuevo Cliente" onClose={() => setModal(null)}>
          <ClienteForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} />
        </Modal>
      )}

      {modal?.cliente && (
        <Modal title="Editar Cliente" onClose={() => setModal(null)}>
          <ClienteForm
            inicial={modal.cliente}
            onSubmit={handleUpdate}
            onClose={() => setModal(null)}
            loading={saving}
          />
        </Modal>
      )}
    </div>
  );
}