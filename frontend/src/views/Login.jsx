import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImg from '../imgs/logo.png'; 

const Login = () => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Nuevos estados para guardar la información de la API de Unsplash
  const [imagenUnsplash, setImagenUnsplash] = useState(null);
  const [fotografo, setFotografo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const navigate = useNavigate();

  // 2. Ejecutamos la llamada a la API al cargar el componente
  useEffect(() => {
    const buscarImagenesUnsplash = async () => {
      // Reemplaza esto con tu ACCESS_KEY real
      const ACCESS_KEY = 'poyo'; 
      const searchQuery = 'finance'; 
      const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${ACCESS_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json(); 

        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          
          // 3. En lugar de usar document.getElementById, actualizamos el estado
          // Nota: Usamos 'regular' o 'small' dependiendo de la calidad que prefieras
          setImagenUnsplash(data.results[randomIndex].urls.regular);
          setDescripcion(data.results[randomIndex].alt_description || 'Imagen de finanzas'); 
          setFotografo(data.results[randomIndex].user.name);
        }
      } catch (error) {
        console.error('Hubo un problema llamando a la API de Unsplash:', error);
      }
    };

    buscarImagenesUnsplash();
  }, []); // El arreglo vacío asegura que solo se llame una vez al entrar a la página

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const endpoint = esRegistro ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const respuesta = await axios.post(`http://localhost:5000${endpoint}`, { nombre, email, password });
      
      if (!esRegistro) {
        localStorage.setItem('token', respuesta.data.token);
        localStorage.setItem('username', respuesta.data.usuario);
        navigate('/'); 
        window.location.reload(); 
      } else {
        alert('Registro exitoso, ahora inicia sesión');
        setEsRegistro(false);
      }
    } catch (error) {
      alert('Error en la autenticación: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  return (
    <div className="auth-container">
      <div className="tarjeta-modulo">
        
        {/* Tu logo original */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <img src={logoImg} alt="Logo" className="logo" style={{ maxWidth: '100px' }} />
        </div>

        {/* 4. Mostramos la imagen de Unsplash de forma dinámica */}
        {imagenUnsplash && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <img 
              src={imagenUnsplash} 
              alt={descripcion} 
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
              Foto por: {fotografo}
            </p>
          </div>
        )}

        <h2>{esRegistro ? 'Crear Cuenta' : 'MyBalance'}</h2>
        
        <form onSubmit={manejarEnvio}>
          {esRegistro && (
            <div className="campo-form">
              <label>Nombre</label>
              <input type="text" onChange={(e) => setNombre(e.target.value)} required />
            </div>
          )}
          <div className="campo-form">
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="campo-form">
            <label>Contraseña</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-guardar">
            {esRegistro ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>
        
        <p onClick={() => setEsRegistro(!esRegistro)} style={{ cursor: 'pointer', marginTop: '10px', color: '#3b82f6', textAlign: 'center' }}>
          {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </p>
      </div>
    </div>
  );
};

export default Login;
