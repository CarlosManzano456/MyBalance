const express = require('express');
const router = express.Router(); // Creamos un router específico para las metas de ahorro, un router es como un mini servidor que maneja rutas específicas, en este caso las relacionadas con las metas de ahorro
const db = require('../db'); 

// GET: Obtener todas las metas de ahorro de un usuario
const auth = require('../intermedio/auth');
router.get('/', auth, (req, res) => {
    const query = 'SELECT * FROM metas WHERE usuario_id = ?';
    db.query(query, [req.usuario_id], (err, results) => { // Usamos req.usuario_id
        res.json(results);
    });
});
// POST: Crear una nueva meta de ahorro
router.post('/', auth, (req, res) => {
    // cantidad_actual se inicializa en 0 por defecto en la BD, así que no la pedimos al crear
    const { nombre, cantidad_total, icono, color_barra, fecha_limite } = req.body;
    const usuario_id = req.usuario_id; // Obtenemos el ID del usuario desde el token
    const query = 'INSERT INTO metas (usuario_id, nombre, cantidad_total, icono, color_barra, fecha_limite) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [usuario_id, nombre, cantidad_total, icono, color_barra, fecha_limite], (err, result) => {
        if (err) {
            console.error('Error al crear la meta:', err);
            return res.status(500).json({ error: 'Error al guardar en la base de datos' });
        }
        res.status(201).json({ 
            mensaje: 'Meta creada con éxito', 
            id_meta: result.insertId 
        });
    });
});

router.delete('/:id', auth, (req, res) => {
    const metaId = req.params.id;
    const usuarioId = req.usuario_id; // Obtenemos el ID del usuario desde el token
    
    const query = 'DELETE FROM metas WHERE id = ? AND usuario_id = ?';
    db.query(query, [metaId, usuarioId], (err, result) => {
        if (err) {
            console.error('Error al eliminar la meta:', err);
            return res.status(500).json({ error: 'Error al eliminar la meta' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Meta no encontrada o no pertenece al usuario' });
        }
        res.json({ mensaje: 'Meta eliminada con éxito' });
    });
});

router.put('/:id', auth, (req, res) => {
    const metaId = req.params.id;
    const usuarioId = req.usuario_id; 
    
    // Agregamos cantidad_actual para que se guarde el ahorro
    const { nombre, cantidad_total, cantidad_actual, icono, color_barra, fecha_limite } = req.body;

    // Actualizamos la consulta para incluir cantidad_actual = ?
    const query = 'UPDATE metas SET nombre = ?, cantidad_total = ?, cantidad_actual = ?, icono = ?, color_barra = ?, fecha_limite = ? WHERE id = ? AND usuario_id = ?';
    
    db.query(query, [nombre, cantidad_total, cantidad_actual, icono, color_barra, fecha_limite, metaId, usuarioId], (err, result) => {
        if (err) {
            console.error('Error al actualizar la meta:', err);
            return res.status(500).json({ error: 'Error al actualizar la meta' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Meta no encontrada o no pertenece al usuario' });
        }
        res.json({ mensaje: 'Meta actualizada con éxito' });
    });
});

module.exports = router;