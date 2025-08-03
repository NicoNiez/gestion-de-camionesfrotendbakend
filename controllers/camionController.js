const db = require('../config/db.js');

const camionController = {
    createCamion: (req, res) => {
        const { numero_camion, marca, modelo, anio, matricula, tipo_camion, uso_camion, capacidad_carga, kilometraje, fecha_mantenimiento, estado, estado_neumaticos, seguro, empresa_seguro, telefono_seguro, email_seguro } = req.body;
        if (!numero_camion || !marca || !modelo || !anio || !matricula || !tipo_camion) {
            return res.status(400).send({ error: 'Faltan datos obligatorios para registrar el camión.' });
        }
        const query = `
            INSERT INTO camiones (numero_camion, marca, modelo, anio, matricula, tipo_camion, uso_camion, capacidad_carga, kilometraje, fecha_mantenimiento, estado, estado_neumaticos, seguro, empresa_seguro, telefono_seguro, email_seguro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [numero_camion, marca, modelo, anio, matricula, tipo_camion, uso_camion, capacidad_carga || null, kilometraje || null, fecha_mantenimiento || null, estado || null, estado_neumaticos || null, seguro || null, empresa_seguro || null, telefono_seguro || null, email_seguro || null], (err, result) => {
            if (err) {
                console.error('Error al insertar los datos:', err.message);
                return res.status(500).send({ error: 'Error al insertar los datos en la base de datos.' });
            }
            res.status(201).send({ message: 'Camión registrado exitosamente.', id: result.insertId, camionData: req.body });
        });
    },
    getCamiones: (req, res) => {
        const query = `SELECT numero_camion, modelo FROM camiones`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener la lista de camiones:', err.message);
                res.status(500).json({ error: 'Error al obtener la lista de camiones' });
                return;
            }
            res.json(results);
        });
    },
    getCamion: (req, res) => {
        const { numero_camion } = req.params;
        db.query('SELECT * FROM camiones WHERE numero_camion = ?', [numero_camion], (err, results) => {
          if (err) {
            console.error('Error al obtener el camión:', err.message);
            res.status(500).json({ error: 'Error al obtener el camión' });
            return;
          }
          if (results.length === 0) {
            res.status(404).json({ error: 'Camión no encontrado' });
            return;
          }
          res.json(results[0]);
        });
      },
      updateCamion: (req, res) => {
        const { numero_camion } = req.params;
        const { marca, modelo, anio, matricula, tipo_camion, uso_camion, capacidad_carga, kilometraje, fecha_mantenimiento, estado, estado_neumaticos, seguro, empresa_seguro, telefono_seguro, email_seguro } = req.body;

        const query = `
          UPDATE camiones
          SET marca = ?, modelo = ?, anio = ?, matricula = ?, tipo_camion = ?,
              uso_camion = ?, capacidad_carga = ?, kilometraje = ?,
              fecha_mantenimiento = ?, estado = ?, estado_neumaticos = ?,
              seguro = ?, empresa_seguro = ?, telefono_seguro = ?,
              email_seguro = ?
          WHERE numero_camion = ?
        `;

        db.query(query, [
          marca, modelo, anio, matricula, tipo_camion, uso_camion, capacidad_carga, kilometraje, fecha_mantenimiento, estado, estado_neumaticos, seguro, empresa_seguro, telefono_seguro, email_seguro, numero_camion
        ], (err, result) => {
          if (err) {
            console.error('Error al actualizar camión:', err.message);
            res.status(500).json({ error: 'Error al actualizar camión' });
            return;
          }

          if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Camión no encontrado' });
            return;
          }

          res.json({ message: 'Camión actualizado con éxito' });
        });
      },
      deleteCamion: (req, res) => {
        const { numero_camion } = req.params;
        const query = 'DELETE FROM camiones WHERE numero_camion = ?';

        db.query(query, [numero_camion], (err, result) => {
          if (err) {
            console.error('Error al eliminar camión:', err.message);
            res.status(500).json({ error: 'Error al eliminar camión' });
            return;
          }

          if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Camión no encontrado' });
            return;
          }

          res.json({ message: 'Camión eliminado con éxito' });
        });
      }
};

module.exports = camionController;