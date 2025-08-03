const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obtiene el token del encabezado de autorización
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Bearer <token>

            jwt.verify(token, 'secreto', (err, decoded) => { // Reemplaza 'secreto' con tu clave secreta
                if (err) {
                    // Token no válido
                    console.error('Error al verificar token:', err.message);
                    return res.status(401).json({ error: 'Token inválido' });
                } else {
                    // Token válido
                    req.usuario = decoded; // Almacena la información del usuario decodificada en el objeto de solicitud
                    next(); // Permite que la solicitud continúe
                }
            });
        } else {
            // No se proporcionó token
            return res.status(401).json({ error: 'No se proporcionó token' });
        }
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error.message);
        return res.status(500).json({ error: 'Error en el servidor de autenticación' });
    }
};

module.exports = authMiddleware;
