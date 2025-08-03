const express = require('express');
    const router = express.Router();
    const camionController = require('../controllers/camionController.js');
    const authMiddleware = require('../middleware/auth.js');  // Importa el middleware de autenticación

    // Rutas para camiones
    router.post('/', authMiddleware, camionController.createCamion);
    router.get('/', authMiddleware, camionController.getCamiones);
    router.get('/:numero_camion', authMiddleware, camionController.getCamion);
    router.put('/:numero_camion', authMiddleware, camionController.updateCamion);
    router.delete('/:numero_camion', authMiddleware, camionController.deleteCamion);

    module.exports = router;