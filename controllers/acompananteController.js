
const path = require('path');
const fs = require('fs');
const db = require('../config/db.js');
const upload = require('../middleware/multerConfig');

const acompananteController = {
  // Obtener todos los acompañantes
  getAcompanantes: (req, res) => {
    db.query('SELECT * FROM acompanantes', (err, results) => {
      if (err) {
        console.error('Error al obtener acompañantes:', err.message);
        res.status(500).json({ error: 'Error al obtener acompañantes' });
        return;
      }

      console.log('Datos obtenidos de la base de datos (acompañantes):', results);

      const acompanantes = results.map(a => ({
        ...a,
        foto: a.foto ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(a.foto)}` : null
      }));

      res.json(acompanantes);
    });
  },

  // Obtener un acompañante por id
  getAcompanante: (req, res) => {
    const { id } = req.params;

    console.log('Parámetro recibido:', id);

    db.query('SELECT * FROM acompanantes WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al obtener el acompañante:', err.message);
        res.status(500).json({ error: 'Error al obtener el acompañante' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Acompañante no encontrado' });
        return;
      }

      const a = results[0];

      console.log('Acompañante encontrado en la base de datos:', a);

      a.foto = a.foto ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(a.foto)}` : null;

      res.json(a);
    });
  },

  // Crear un acompañante nuevo con foto
  createAcompanante: [
    upload.single('foto'),
    (req, res) => {
      console.log('Datos recibidos del frontend:', req.body);
      console.log('Archivo recibido:', req.file);

      const {
        nombre, apellido, edad, documento, nacionalidad,
        pais_residencia, provincia, ciudad, tipo_sangre,
        id_registro_general
        // Eliminé numero_conductor porque no existe en la tabla
      } = req.body;

      const foto = req.file ? req.file.path : null;

      const query = `
        INSERT INTO acompanantes (
          nombre, apellido, edad, documento, nacionalidad,
          pais_residencia, provincia, ciudad, tipo_sangre,
          id_registro_general, foto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const valores = [
        nombre, apellido, edad, documento, nacionalidad,
        pais_residencia, provincia, ciudad, tipo_sangre,
        id_registro_general, foto
      ];

      console.log('Datos que se insertarán en la base de datos:', valores);

      db.query(query, valores, (err, result) => {
        if (err) {
          console.error('Error al agregar acompañante:', err.message);
          res.status(500).json({ error: 'Error al agregar acompañante' });
          return;
        }

        console.log('Resultado de inserción en base de datos:', result);

        res.json({
          id: result.insertId,
          nombre, apellido, edad, documento, nacionalidad,
          pais_residencia, provincia, ciudad, tipo_sangre,
          id_registro_general, foto
        });
      });
    }
  ],

  // Actualizar un acompañante por id con posible nueva foto
  updateAcompanante: [
    upload.single('foto'),
    (req, res) => {
      const { id } = req.params;
      const {
        nombre, apellido, edad, documento, nacionalidad,
        pais_residencia, provincia, ciudad, tipo_sangre,
        id_registro_general
        // Eliminé numero_conductor porque no existe en la tabla
      } = req.body;

      console.log('Datos recibidos para actualización:', req.body);
      console.log('Archivo recibido para actualización:', req.file);

      db.query('SELECT foto FROM acompanantes WHERE id = ?', [id], (err, results) => {
        if (err) {
          console.error('Error al buscar acompañante:', err.message);
          return res.status(500).json({ error: 'Error al buscar acompañante' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Acompañante no encontrado' });
        }

        const fotoActual = results[0].foto;
        let nuevaFoto = fotoActual;

        if (req.file) {
          nuevaFoto = req.file.path;
          if (fotoActual && fotoActual !== nuevaFoto) {
            const rutaFotoActual = path.resolve(fotoActual);
            if (fs.existsSync(rutaFotoActual)) {
              fs.unlinkSync(rutaFotoActual);
              console.log('Foto anterior eliminada:', rutaFotoActual);
            }
          }
        }

        const query = `
          UPDATE acompanantes SET
            nombre = ?, apellido = ?, edad = ?, documento = ?, nacionalidad = ?,
            pais_residencia = ?, provincia = ?, ciudad = ?, tipo_sangre = ?,
            id_registro_general = ?, foto = ?
          WHERE id = ?
        `;

        const valores = [
          nombre, apellido, edad, documento, nacionalidad,
          pais_residencia, provincia, ciudad, tipo_sangre,
          id_registro_general, nuevaFoto, id
        ];

        console.log('Datos que se actualizarán en la base de datos:', valores);

        db.query(query, valores, (err2) => {
          if (err2) {
            console.error('Error al actualizar acompañante:', err2.message);
            return res.status(500).json({ error: 'Error al actualizar acompañante' });
          }
          res.json({ message: 'Acompañante actualizado con éxito' });
        });
      });
    }
  ],

  // Eliminar un acompañante por id y borrar foto
  deleteAcompanante: (req, res) => {
    const { id } = req.params;

    console.log('ID recibido para eliminación:', id);

    db.query('SELECT foto FROM acompanantes WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al buscar acompañante:', err.message);
        return res.status(500).json({ error: 'Error al buscar acompañante' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Acompañante no encontrado' });
      }

      const foto = results[0].foto;

      db.query('DELETE FROM acompanantes WHERE id = ?', [id], (err2) => {
        if (err2) {
          console.error('Error al eliminar acompañante:', err2.message);
          return res.status(500).json({ error: 'Error al eliminar acompañante' });
        }

        console.log('Acompañante eliminado de la base de datos con ID:', id);

        if (foto) {
          const rutaFoto = path.resolve(foto);
          if (fs.existsSync(rutaFoto)) {
            fs.unlinkSync(rutaFoto);
            console.log('Foto eliminada del servidor:', rutaFoto);
          }
        }

        res.json({ message: 'Acompañante eliminado con éxito' });
      });
    });
  }
};

module.exports = acompananteController;
