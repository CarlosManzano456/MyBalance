import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillBarChartLineFill,BsClipboard,BsCreditCard2Back, BsFillPiggyBankFill} from "react-icons/bs";
import logoImg from '../imgs/logo.png'; 

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Limpiamos también el nombre
    navigate('/login');
    window.location.reload(); // Recarga para limpiar el estado
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2><img src={logoImg} alt="Logo" className='logo'/>MyBalance</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/"><BsFillBarChartLineFill /> Resumen</Link></li>
          <li><Link to="/transacciones"><BsCreditCard2Back /> Transacciones</Link></li>
          <li><Link to="/metas"><BsClipboard /> Metas de Ahorro</Link></li>
          <li><Link to="/proyecciones"><BsFillPiggyBankFill /> Proyecciones</Link></li>
        </ul>
      </nav>

      <div className="sidebar-footer">

        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
        
      </div>
    </aside>
  );
};

export default Sidebar;