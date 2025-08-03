const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../config/db.js');

// Configuración multer para almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Crear carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Cambiar el nombre para evitar colisiones
    const ext = path.extname(file.originalname);
    const nombreArchivo = `${Date.now()}${ext}`;
    cb(null, nombreArchivo);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPEG, PNG o GIF'));
  }
};

// Límite tamaño máximo (2MB)
const upload = multer({
  storage,
  fileFilter,
limits: { fileSize: 10 * 1024 * 1024 }

});

// Controlador
const conductorController = {

  // Listar todos
  getConductores: (req, res) => {
    db.query('SELECT * FROM conductores', (err, results) => {
      if (err) {
        console.error('Error al obtener conductores:', err.message);
        return res.status(500).json({ error: 'Error al obtener conductores' });
      }

      // Convertir ruta a URL para la foto
      const conductores = results.map(c => ({
        ...c,
        foto: c.foto ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(c.foto)}` : null
      }));

      res.json(conductores);
    });
  },

  // Obtener uno
  getConductor: (req, res) => {
    const { numero_conductor } = req.params;
    db.query('SELECT * FROM conductores WHERE numero_conductor = ?', [numero_conductor], (err, results) => {
      if (err) {
        console.error('Error al obtener el conductor:', err.message);
        return res.status(500).json({ error: 'Error al obtener el conductor' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
      }

      const c = results[0];
      c.foto = c.foto ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(c.foto)}` : null;

      res.json(c);
    });
  },

  // Crear nuevo conductor con foto (middleware multer)
  createConductor: [
    upload.single('foto'),  // El campo "foto" es el archivo
    (req, res) => {
      const { nombre, apellido, edad, documento, nacionalidad, pais_residencia, provincia, ciudad, tipo_sangre, fecha_cumple } = req.body;
      let rutaFoto = null;
      if (req.file) {
        rutaFoto = req.file.path; // ruta en servidor (relativa)
      }

      const query = `
        INSERT INTO conductores 
          (nombre, apellido, edad, documento, nacionalidad, pais_residencia, provincia, ciudad, tipo_sangre, foto, fecha_cumple)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(query, [nombre, apellido, edad, documento, nacionalidad, pais_residencia, provincia, ciudad, tipo_sangre, rutaFoto, fecha_cumple], (err, result) => {
        if (err) {
          console.error('Error al agregar conductor:', err.message);
          return res.status(500).json({ error: 'Error al agregar conductor' });
        }
        res.json({ 
          id: result.insertId,
          nombre, apellido, edad, documento, nacionalidad, pais_residencia, provincia, ciudad, tipo_sangre, foto: rutaFoto, fecha_cumple 
        });
      });
    }
  ],

  // Actualizar conductor con posible nueva foto
  updateConductor: [
    upload.single('foto'),
    (req, res) => {
      const { numero_conductor } = req.params;
      const { nombre, apellido, edad, documento, nacionalidad, pais_residencia, provincia, ciudad, tipo_sangre, fecha_cumple } = req.body;

      // Primero obtenemos el conductor para borrar la foto anterior si se actualiza
      db.query('SELECT foto FROM conductores WHERE numero_conductor = ?', [numero_conductor], (err, results) => {
        if (err) {
          console.error('Error al buscar conductor:', err.message);
          return res.status(500).json({ error: 'Error al buscar conductor' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Conductor no encontrado' });
        }

        const fotoActual = results[0].foto;
        let nuevaFoto = fotoActual;

        if (req.file) {
          nuevaFoto = req.file.path;

          // Borrar la foto anterior si existe y es diferente
          if (fotoActual && fotoActual !== nuevaFoto && fs.existsSync(fotoActual)) {
            fs.unlinkSync(fotoActual);
          }
        }

        const query = `
          UPDATE conductores
          SET nombre = ?, apellido = ?, edad = ?, documento = ?, nacionalidad = ?, pais_residencia = ?, provincia = ?, ciudad = ?, tipo_sangre = ?, foto = ?, fecha_cumple = ?
          WHERE numero_conductor = ?
        `;

        db.query(query, [nombre, apellido, edad, documento, nacionalidad, pais_residencia, provincia, ciudad, tipo_sangre, nuevaFoto, fecha_cumple, numero_conductor], (err2) => {
          if (err2) {
            console.error('Error al actualizar conductor:', err2.message);
            return res.status(500).json({ error: 'Error al actualizar conductor' });
          }
          res.json({ message: 'Conductor actualizado con éxito' });
        });
      });
    }
  ],

  // Eliminar conductor y foto física
  deleteConductor: (req, res) => {
    const { numero_conductor } = req.params;

    // Buscar foto antes de borrar registro
    db.query('SELECT foto FROM conductores WHERE numero_conductor = ?', [numero_conductor], (err, results) => {
      if (err) {
        console.error('Error al buscar conductor:', err.message);
        return res.status(500).json({ error: 'Error al buscar conductor' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
      }

      const foto = results[0].foto;

      db.query('DELETE FROM conductores WHERE numero_conductor = ?', [numero_conductor], (err2) => {
        if (err2) {
          console.error('Error al eliminar conductor:', err2.message);
          return res.status(500).json({ error: 'Error al eliminar conductor' });
        }

        // Borrar archivo de foto si existe
        if (foto && fs.existsSync(foto)) {
          fs.unlinkSync(foto);
        }

        res.json({ message: 'Conductor eliminado con éxito' });
      });
    });
  }

};

module.exports = conductorController;
