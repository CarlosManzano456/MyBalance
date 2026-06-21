const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const proyeccionesRoutes = require('./routes/proyecciones');
const transaccionesRoutes = require('./routes/transacciones');
const metasRoutes = require('./routes/metas'); 
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error obteniendo usuarios' });
        } else {
            res.json(results);
        }
    });
});

app.use('/api/transacciones', transaccionesRoutes);
// NUEVO: Le decimos a Express que use nuestras rutas para /api/metas
app.use('/api/metas', metasRoutes);
app.use('/api/proyecciones', proyeccionesRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor de MyBalance corriendo en http://localhost:${PORT}`);
});