import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa el nuevo archivo

const Resumen = () => {
  // Aquí guardaremos los datos que lleguen del backend
  const [transacciones, setTransacciones] = useState([]);
  const [metas, setMetas] = useState([]);
  const username = localStorage.getItem('username') || 'Usuario';
  

  // useEffect hace que esto se ejecute automáticamente al abrir la pantalla
  useEffect(() => {
    // 1. Pedimos el historial de transacciones de cualquier usuario, con el webtoken 
    api.get('/transacciones') // Usamos la función get de nuestro api.js, que ya incluye el token automáticamente
      .then(respuesta => {
        setTransacciones(respuesta.data);
      })
      .catch(error => console.error("Error al cargar transacciones:", error));

    // 2. Pedimos las metas de ahorro del usuario 1
    api.get('/metas') // De nuevo, usamos api.js para incluir el token
      .then(respuesta => {
        setMetas(respuesta.data);
      })
      .catch(error => console.error("Error al cargar metas:", error));
  }, []);

  // Calculamos el balance total sumando todas las transacciones (ingresos y gastos)
  const balanceTotal = transacciones.reduce((total, transaccion) => {
    return total + parseFloat(transaccion.cantidad);
  }, 0);

// 1. Filtramos solo los gastos (cantidades negativas)
const gastos = transacciones.filter(tx => parseFloat(tx.cantidad) < 0);

// 1. Filtramos solo los gastos (cantidades negativas)
const ingresos = transacciones.filter(tx => parseFloat(tx.cantidad) > 0);


// 2. Calculamos la suma total de TODOS los gastos
const totalGastos = gastos.reduce((suma, tx) => suma + Math.abs(parseFloat(tx.cantidad)), 0);
const totalIngresos = ingresos.reduce((suma, tx) => suma + parseFloat(tx.cantidad), 0);

  return (
    <div className="vista-resumen">
      <header className="header-resumen">

        <h1>Bienvenido, {username}</h1>
        <p>Aquí tienes el resumen de tus finanzas.</p>
      </header>

      <div className="tarjeta-balance-total">
        <h3>Balance Total</h3>
        {/* toFixed(2) asegura que siempre se muestren 2 decimales */}
        <h2>${balanceTotal.toFixed(2)}</h2> 
        <h3>Total de Ingresos</h3>
        <p>${totalIngresos.toFixed(2)}</p>
        <h3>Total de Gastos</h3>
        <p>${totalGastos.toFixed(2)}</p>
        
      </div>

      <div className="grid-resumen">
        {/* --- SECCIÓN DE HISTORIAL RÁPIDO --- */}
        <div className="tarjeta-modulo">
          <h3>Últimos Movimientos</h3>
         <div className="tabla-responsive scrollable">
            <table className="tabla-transacciones ">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.fecha).toLocaleDateString()}</td>
                    <td>{tx.nombre}</td>
                    <td><span className="badge-categoria">{tx.tipo}</span></td>
                    <td style={{ color: tx.cantidad > 0 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                      ${Math.abs(tx.cantidad).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="tarjeta-modulo scrollable" style={{ maxHeight: '400px' }}>
          <h3>Progreso de Metas</h3>
          <ul className="lista-sencilla">
            {metas.map(meta => {
              const porcentaje = meta.cantidad_actual / meta.cantidad_total * 100;
              return(
              
              <li key={meta.id} className="item-meta">
                <div className="meta-info">
                  <span>{meta.nombre}</span>
                  <span>${meta.cantidad_actual} / ${meta.cantidad_total}</span>
                </div>
                <div className="barra-fondo">
                  <div className="barra-progreso" style={{ width: `${porcentaje > 100 ? 100 : porcentaje}%`, backgroundColor: meta.color_barra }}></div>
                </div>
                
              </li>
              
            )})}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Resumen;