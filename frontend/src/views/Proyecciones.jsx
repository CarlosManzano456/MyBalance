import React, { useState } from 'react';
import axios from 'axios';
import { BsFillPiggyBankFill, BsQuestionCircleFill} from "react-icons/bs";


const Proyecciones = () => {
  const [monto, setMonto] = useState('');
  const [tasaAnual, setTasaAnual] = useState('');
  const [plazos, setPlazos] = useState('');
  
  // Aquí guardaremos el resultado del backend
  const [resultado, setResultado] = useState(null);

  // Estado para controlar si el modal está abierto o cerrado
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const calcularPrestamo = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/proyecciones/calcular', {
      monto: monto,
      tasa_anual: tasaAnual,
      plazos: plazos
    })
    .then(respuesta => {
      setResultado(respuesta.data);
    })
    .catch(error => console.error("Error al calcular:", error));
  };

  return (
    <div className="vista-proyecciones">
      <header className="header-resumen header-flex">
        <div>
          <h1><BsFillPiggyBankFill/> Proyecciones y Préstamos</h1>
          <p>Simula un préstamo y conoce tu tabla de amortización.</p>
        </div>
        <button onClick={() => setMostrarAyuda(true)}>
          <BsQuestionCircleFill size={32}/>
          
        </button>
    </header>

      <div className="grid-transacciones">
        {/* FORMULARIO */}
        <div className="tarjeta-modulo form-container" style={{ alignSelf: 'start' }}>
          <h3>Datos del Préstamo</h3>
          <form onSubmit={calcularPrestamo}>
            <div className="campo-form">
              <label>Monto Solicitado ($)</label>
              <input 
                type="number" required 
                placeholder="10000"
                value={monto} 
                onChange={(e) => setMonto(e.target.value)} 
              />
            </div>
            <div className="campo-form">
              <label>Tasa de Interés Anual (%)</label>
              <input 
                type="number" required step="0.1"
                placeholder="12.5"
                value={tasaAnual} 
                onChange={(e) => setTasaAnual(e.target.value)} 
              />
            </div>
            <div className="campo-form">
              <label>Plazo (Meses)</label>
              <input 
                type="number" required 
                placeholder="24"
                value={plazos} 
                onChange={(e) => setPlazos(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn-guardar">Calcular</button>
          </form>
        </div>

        {/* RESULTADOS Y TABLA */}
        {resultado && (
          <div className="resultados-simulacion">
            <div className="grid-resumen" style={{ marginBottom: '20px' }}>
              <div className="tarjeta-modulo" style={{ backgroundColor: '#111827', color: 'white' }}>
                <h3 style={{ color: '#9ca3af', marginBottom: '5px', fontSize: '16px' }}>Cuota Mensual</h3>
                <h2 style={{ fontSize: '32px' }}>${resultado.cuota_mensual}</h2>
              </div>
              <div className="tarjeta-modulo" style={{ backgroundColor: '#f3f4f6' }}>
                <h3 style={{ color: '#6b7280', marginBottom: '5px', fontSize: '16px' }}>Total a Pagar</h3>
                <h2 style={{ fontSize: '32px', color: '#1f2937' }}>${resultado.total_pagar}</h2>
              </div>
            </div>

            <div className="tarjeta-modulo">
              <h3>Tabla de Amortización</h3>
              <div className="tabla-responsive scrollable">
                <table className="tabla-transacciones">
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th>Mes</th>
                      <th>Cuota</th>
                      <th>A Capital</th>
                      <th>Interés</th>
                      <th>Saldo Restante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.tabla_amortizacion.map(fila => (
                      <tr key={fila.mes}>
                        <td>{fila.mes}</td>
                        <td>${fila.cuota}</td>
                        <td>${fila.capital}</td>
                        <td>${fila.interes}</td>
                        <td style={{ fontWeight: 'bold' }}>${fila.saldo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>


      {mostrarAyuda && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-cerrar-modal" onClick={() => setMostrarAyuda(false)}>&times;</button>
            <h3 style={{ marginBottom: '20px', fontSize: '24px', color: '#111827' }}>Glosario de Amortización</h3>
            
            <div className="modal-body-scroll">
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
                <strong>Saldo insoluto:</strong> Es el capital que se debe de la deuda. Va disminuyendo con los pagos realizados.
              </p>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
                <strong>Intereses:</strong> Pago por el uso del dinero ajeno (Saldo anterior × Tasa mensual).
              </p>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
                <strong>Pago al capital:</strong> Dinero real que reduce la deuda (Cuota - Intereses).
              </p>
              <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6' }}>
                <strong>Cuota (Anualidad):</strong> Suma del interés y pago a capital. Se mantiene fija en el Sistema Francés.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyecciones;