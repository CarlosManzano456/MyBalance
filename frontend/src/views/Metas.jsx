import React, { useState, useEffect } from 'react';
import api from '../api';


const Metas = () => {
  const [metas, setMetas] = useState([]);
  
  // Estados para CREAR una meta
  const [nombre, setNombre] = useState('');
  const [cantidadTotal, setCantidadTotal] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');

  // Estado para EDITAR una meta (si es null, el modal está cerrado)
  const [metaEditada, setMetaEditada] = useState(null);

  const cargarMetas = () => {
    api.get('/metas')
      .then(respuesta => setMetas(respuesta.data))
      .catch(error => console.error("Error al cargar metas:", error));
  };

  useEffect(() => {
    cargarMetas();
  }, []);

  // --- CREAR META ---
  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevaMeta = {
      nombre: nombre,
      cantidad_total: parseFloat(cantidadTotal),
      icono: '', // Por ahora dejamos el icono vacío, podríamos agregar una selección en el futuro
      color_barra: '#3b82f6', 
      fecha_limite: fechaLimite
    };

    api.post('/metas', nuevaMeta)
      .then(() => {
        setNombre('');
        setCantidadTotal('');
        setFechaLimite('');
        cargarMetas();
      })
      .catch(error => console.error("Error al crear meta:", error));
  };

  // --- ELIMINAR META ---
  const eliminarMeta = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta meta?")) {
      api.delete(`/metas/${id}`)
        .then(() => cargarMetas())
        .catch(error => console.error("Error al eliminar:", error));
    }
  };

  // --- ABRIR MODAL DE EDICIÓN ---
  const abrirModalEdicion = (meta) => {
    // Solución al error de MySQL: Formateamos la fecha a YYYY-MM-DD para el input type="date"
    const fechaFormateada = meta.fecha_limite 
      ? new Date(meta.fecha_limite).toISOString().split('T')[0] 
      : '';

    setMetaEditada({
      ...meta,
      fecha_limite: fechaFormateada // Asignamos la fecha ya limpia
    });
  };

  // --- MANEJAR CAMBIOS EN EL FORMULARIO DE EDICIÓN ---
  const handleChangeEdicion = (e) => {
    setMetaEditada({
      ...metaEditada,
      [e.target.name]: e.target.value
    });
  };

  // --- GUARDAR LOS CAMBIOS EDITADOS ---
  const guardarEdicion = (e) => {
    e.preventDefault();
    
    // El backend ahora recibirá la fecha limpia y todos los datos completos
    api.put(`/metas/${metaEditada.id}`, {
      nombre: metaEditada.nombre,
      cantidad_total: parseFloat(metaEditada.cantidad_total),
      cantidad_actual: parseFloat(metaEditada.cantidad_actual),
      icono: metaEditada.icono,
      color_barra: metaEditada.color_barra,
      fecha_limite: metaEditada.fecha_limite
    })
    .then(() => {
      setMetaEditada(null); // Cerramos el modal
      cargarMetas(); // Recargamos las tarjetas
    })
    .catch(error => alert("Error al actualizar la meta"));
  };

  const calcularPorcentaje = (actual, total) => {
    if (total === 0) return 0;
    return Math.round((actual / total) * 100);
  };

  return (
    <div className="vista-metas">
      <header className="header-resumen">
        <h1>Metas de Ahorro</h1>
        <p>Establece objetivos, suma fondos y haz seguimiento.</p>
      </header>

      <div className="grid-transacciones">
        {/* FORMULARIO PARA CREAR */}
        <div className="tarjeta-modulo form-container">
          <h3>Crear Nueva Meta</h3>
          <form onSubmit={manejarEnvio}>
            <div className="campo-form">
              <label>¿Qué quieres lograr?</label>
              <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="campo-form">
              <label>Cantidad Objetivo ($)</label>
              <input type="number" required step="0.01" value={cantidadTotal} onChange={(e) => setCantidadTotal(e.target.value)} />
            </div>
            <div className="campo-form">
              <label>Fecha Límite</label>
              <input type="date" required value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} />
            </div>
            <button type="submit" className="btn-guardar">Guardar Meta</button>
          </form>
        </div>

        {/* TARJETAS DE METAS */}
        <div className="grid-tarjetas-metas">
          {metas.map(meta => {
            const porcentaje = calcularPorcentaje(meta.cantidad_actual, meta.cantidad_total);
            return (
              <div key={meta.id} className="tarjeta-meta-detalle">
                <div className="meta-header">
                  <h4>{meta.nombre}</h4>
                  <span className="porcentaje">{porcentaje}%</span>
                </div>
                
                <div className="barra-fondo">
                  <div className="barra-progreso" style={{ width: `${porcentaje > 100 ? 100 : porcentaje}%`, backgroundColor: meta.color_barra }}></div>
                </div>

                <div className="meta-footer">
                  <span>Ahorrado: <strong>${meta.cantidad_actual}</strong></span>
                  <span>Objetivo: <strong>${meta.cantidad_total}</strong></span>
                </div>

                {/* BOTONES ACTUALIZADOS */}
                <div className="acciones-tarjeta">
                  <button className="btn-accion btn-ahorrar" onClick={() => abrirModalEdicion(meta)}>
                    Editar / Ahorrar
                  </button>
                  <button className="btn-accion btn-eliminar" onClick={() => eliminarMeta(meta.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {metaEditada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-cerrar-modal" onClick={() => setMetaEditada(null)}>&times;</button>

            <h3 style={{ marginBottom: '20px', fontSize: '24px', color: '#111827' }}>Editar Meta</h3>

            <form onSubmit={guardarEdicion}>
              <div className="campo-form">
                <label>Nombre de la Meta</label>
                <input type="text" name="nombre" value={metaEditada.nombre} onChange={handleChangeEdicion} required />
              </div>
              
              
                <div className="campo-form">
                  <label>Ahorro Actual ($)</label>
                  <input type="number" step="0.01" name="cantidad_actual" value={metaEditada.cantidad_actual} onChange={handleChangeEdicion} required />
                </div>
                <div className="campo-form">
                  <label>Monto Objetivo ($)</label>
                  <input type="number" step="0.01" name="cantidad_total" value={metaEditada.cantidad_total} onChange={handleChangeEdicion} required />
                </div>
             

              <div className="fila-form">
                <div className="campo-form" style={{ flex: 2 }}> {/* Dejamos este flex simple para la proporción del input date */}
                  <label>Fecha Límite</label>
                  <input type="date" name="fecha_limite" value={metaEditada.fecha_limite} onChange={handleChangeEdicion} required />
                </div>
                <div className="campo-form" style={{ flex: 1 }}>
                  <label>Color</label>
                  <input type="color" name="color_barra" value={metaEditada.color_barra || '#3b82f6'} onChange={handleChangeEdicion} style={{ height: '42px', padding: '2px', cursor: 'pointer' }} />
                </div>
              </div>

              <button type="submit" className="btn-guardar">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metas;