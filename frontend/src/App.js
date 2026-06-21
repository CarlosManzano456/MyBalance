import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Resumen from './views/Resumen';
import Transacciones from './views/Transacciones';
import Metas from './views/Metas';
import Proyecciones from './views/Proyecciones';
import Login from './views/Login';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        {token && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <Resumen /> : <Navigate to="/login" />} />
            <Route path="/transacciones" element={token ? <Transacciones /> : <Navigate to="/login" />} />
            <Route path="/metas" element={token ? <Metas /> : <Navigate to="/login" />} />
            <Route path="/proyecciones" element={token ? <Proyecciones /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;