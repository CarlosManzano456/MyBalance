const express = require('express');
const router = express.Router(); // Creamos un router específico para transacciones, un router es como un mini-app dentro de Express que nos permite organizar mejor nuestras rutas
const db = require('../db'); // Subimos un nivel para conectar con db.js

// GET: Obtener todo el historial de un usuario (ordenado por fecha)
//una app en express es como un restaurante, el router es como un camarero que se encarga de una sección específica del menú (en este caso, las transacciones). Cuando llega una orden (una petición HTTP), el router sabe exactamente qué hacer con ella, ya sea traer la lista de transacciones o agregar una nueva. Esto nos ayuda a mantener nuestro código organizado y fácil de manejar a medida que nuestra aplicación crece.
const auth = require('../intermedio/auth');
router.get('/', auth, (req, res) => {
    const query = 'SELECT * FROM transacciones WHERE usuario_id = ?';
    db.query(query, [req.usuario_id], (err, results) => { // Usamos req.usuario_id
        res.json(results);
    });
});

// POST: Registrar un nuevo ingreso o gasto
router.post('/', auth, (req, res) => {
    const { nombre, cantidad, tipo, tipo_movimiento, fecha } = req.body;
    
    const query = 'INSERT INTO transacciones (usuario_id, nombre, cantidad, tipo, tipo_movimiento, fecha) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [req.usuario_id, nombre, cantidad, tipo, tipo_movimiento, fecha], (err, result) => {
        if (err) {
            console.error('Error al guardar la transacción:', err);
            return res.status(500).json({ error: 'Error al guardar en la base de datos' });
        }
        res.status(201).json({ 
            mensaje: 'Transacción registrada con éxito', 
            id_transaccion: result.insertId 
        });
    });
});

module.exports = router;