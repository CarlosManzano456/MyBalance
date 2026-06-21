import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa el nuevo archivo

import {BsCreditCard2Back} from "react-icons/bs";

const Transacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [tipo, setTipo] = useState('Shopping');
  const [tipoMovimiento, setTipoMovimiento] = useState('Gasto');
  const [fecha, setFecha] = useState('');

  // Cargar el historial al abrir la pantalla
  const cargarTransacciones = () => {
    api.get('http://localhost:5000/api/transacciones')
      .then(respuesta => setTransacciones(respuesta.data))
      .catch(error => console.error("Error al cargar:", error));
  };

  useEffect(() => {
    cargarTransacciones();
  }, []);

  // Función para guardar un nuevo registro
  const manejarEnvio = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Preparamos los datos según lo que espera el backend
    const nuevaTransaccion = {
      usuario_id: 1, // Carlos
      nombre: nombre,
      // Si es gasto, lo mandamos como negativo a la base de datos
      cantidad: tipoMovimiento === 'Gasto' ? -Math.abs(cantidad) : Math.abs(cantidad),
      tipo: tipo,
      tipo_movimiento: tipoMovimiento,
      fecha: fecha
    };

    api.post('http://localhost:5000/api/transacciones', nuevaTransaccion)
      .then(() => {
        // Limpiamos el formulario
        setNombre('');
        setCantidad('');
        setFecha('');
        // Recargamos la lista para ver el nuevo dato inmediatamente
        cargarTransacciones();
      })
      .catch(error => console.error("Error al guardar:", error));
  };

  return (
    <div className="vista-transacciones">
      <header className="header-resumen">
        <h1><BsCreditCard2Back /> Transacciones</h1>
        <p>Registra y revisa todos tus movimientos.</p>
      </header>

      <div className="grid-transacciones">
        {/* --- FORMULARIO (Izquierda) --- */}
        <div className="tarjeta-modulo form-container">
          <h3>Nuevo Movimiento</h3>
          <form onSubmit={manejarEnvio}>
            <div className="campo-form">
              <label>Descripción</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Compra de supermercado"
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
              />
            </div>

            <div className="campo-form">
              <label>Cantidad ($)</label>
              <input 
                type="number" 
                required 
                step="0.01"
                placeholder="0.00"
                value={cantidad} 
                onChange={(e) => setCantidad(e.target.value)} 
              />
            </div>

            <div className="fila-form">
              <div className="campo-form">
                <label>Movimiento</label>
                <select value={tipoMovimiento} onChange={(e) => setTipoMovimiento(e.target.value)}>
                  <option value="Gasto">Gasto</option>
                  <option value="Ingreso">Ingreso</option>
                </select>
              </div>

              <div className="campo-form">
                <label>Categoría</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="Shopping">Shopping</option>
                  <option value="Food">Food</option>
                  <option value="Sport">Sport</option>
                  <option value="Salary">Salary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="campo-form">
              <label>Fecha</label>
              <input 
                type="date" 
                required 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn-guardar">Registrar</button>
          </form>
        </div>

        {/* --- TABLA DE HISTORIAL (Derecha) --- */}
        <div className="tarjeta-modulo">
          <h3>Historial Completo</h3>
          <div className="tabla-responsive scrollable" style={{ maxHeight: '400px' }}>
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
      </div>
    </div>
  );
};

export default Transacciones;