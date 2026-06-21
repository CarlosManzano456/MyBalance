const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    // Encriptar la contraseña (salt de 10 rondas)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
        res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
        
        const user = results[0];
        // Comparar contraseña ingresada con la encriptada
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });
        
        // Crear Token (valido por 1 hora)
        const token = jwt.sign({ id: user.id }, 'secreto_super_seguro', { expiresIn: '1h' });
        
        res.json({ token, usuario: user.nombre });
    });
});


module.exports = router;