const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No hay token' });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secreto_super_seguro', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.usuario_id = decoded.id; // Guardamos el ID real aquí
        next();
    });
};