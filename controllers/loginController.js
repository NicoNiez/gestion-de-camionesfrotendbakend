const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
const db = require('../config/db.js'); // Importa la conexión a la base de datos

const loginController = {
    login: (req, res) => {
        const { username, password } = req.body;

        // Verifica las credenciales
        if (username === 'Administrador' && password === '14545') {
            // Genera un token JWT
            const token = jwt.sign({ username: 'Administrador' }, 'secreto', { expiresIn: '1h' }); // Cambia 'secreto' por una clave secreta segura
            res.json({ token, message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    },

    register: (req, res) => {
        const { username, password, email } = req.body;

        // Valida los datos de entrada (¡importante!)
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Faltan datos para el registro' });
        }

        // Verifica si el usuario ya existe (¡importante!)
        const checkUserQuery = 'SELECT * FROM usuarios WHERE username = ?';
        db.query(checkUserQuery, [username], (checkErr, checkResults) => {
            if (checkErr) {
                console.error('Error al verificar usuario:', checkErr.message);
                return res.status(500).json({ error: 'Error al verificar usuario' });
            }

            if (checkResults.length > 0) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            // Inserta el nuevo usuario (¡Usar bcrypt para la contraseña en producción!)
            const insertQuery = 'INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, password, email], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error al registrar usuario:', insertErr.message);
                    return res.status(500).json({ error: 'Error al registrar usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado exitosamente', userId: insertResult.insertId });
            });
        });
    },

    logout: (req, res) => {
        //  La lógica de cierre de sesión puede ser más compleja en una aplicación real
        //  (por ejemplo, invalidar el token JWT en el servidor, si se usa)
        //  Pero, en este ejemplo, simplemente respondemos con un mensaje.
        res.json({ message: 'Cierre de sesión exitoso' });
    }
};

module.exports = loginController;
