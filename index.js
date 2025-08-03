const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar los archivos de rutas
const conductorRoutes = require('./routes/conductorRoutes.js');
const acompananteRoutes = require('./routes/acompananteRoutes.js');
const armadoregistroRoutes = require('./routes/armadoregistroRoutes.js');
const camionRoutes = require('./routes/camionRoutes.js');
const cargaRoutes = require('./routes/cargaRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js');

const app = express();

// Middleware de depuración para ver todas las peticiones entrantes
app.use((req, res, next) => {
    console.log(`Petición recibida: ${req.method} a la URL ${req.originalUrl}`);
    next();
});

// Middleware para servir archivos estáticos de /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Rutas
app.use('/', loginRoutes);
app.use('/conductores', conductorRoutes);
app.use('/acompanantes', acompananteRoutes);
app.use('/armadoregistro', armadoregistroRoutes);
app.use('/camiones', camionRoutes);
app.use('/cargas', cargaRoutes);

// Ruta de healthcheck
app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'El servidor está funcionando correctamente' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});