const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController.js');

// Ruta para el inicio de sesión
router.post('/login', loginController.login);
router.post('/register', loginController.register); // Agregando la ruta de registro
router.post('/logout', loginController.logout);     // Agregando la ruta de logout

module.exports = router;