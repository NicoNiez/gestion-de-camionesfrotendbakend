


const db = require('../config/db.js');

const armadoregistroController = {
  // Obtener todos los registros armados
  getArmadoRegistros: (req, res) => {
    const query = `
      SELECT ar.*,
             ar.acompanante_id,       -- Agregado explícitamente
             ar.carga_id,             -- (opcional pero útil en frontend)
             c.nombre AS nombre_conductor,
             a.nombre AS nombre_acompanante,
             ca.numero_camion AS numero_camion,
             cg.tipo_Carga
      FROM armadoregistro ar
      JOIN conductores c ON ar.conductor_id = c.numero_conductor
      LEFT JOIN acompanantes a ON ar.acompanante_id = a.id
      JOIN camiones ca ON ar.camion = ca.numero_camion
      LEFT JOIN cargas cg ON ar.carga_id = cg.id
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener registros armados:', err.message);
        return res.status(500).json({ error: 'Error al obtener registros armados' });
      }
      res.json(results);
    });
  },

  // Obtener un solo registro armado por ID
  getArmadoRegistro: (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT ar.*,
             ar.acompanante_id,
             ar.carga_id,
             c.nombre AS nombre_conductor,
             a.nombre AS nombre_acompanante,
             ca.numero_camion AS numero_camion,
             cg.tipo_Carga
      FROM armadoregistro ar
      JOIN conductores c ON ar.conductor_id = c.numero_conductor
      LEFT JOIN acompanantes a ON ar.acompanante_id = a.id
      JOIN camiones ca ON ar.camion = ca.numero_camion
      LEFT JOIN cargas cg ON ar.carga_id = cg.id
      WHERE ar.id = ?
    `;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener registro armado:', err.message);
        return res.status(500).json({ error: 'Error al obtener registro armado' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.json(results[0]);
    });
  },

  // Crear un nuevo registro armado
  createArmadoRegistro: (req, res) => {
    console.log('Datos recibidos para crear:', req.body);

    const {
      camion,
      conductor_id,
      destino,
      distancia,
      fecha_salida,
      hora_salida,
      fecha_llegada,
      hora_llegada,
      carga_id,
      acompanante_id,
    } = req.body;

    if (
      !camion || !conductor_id || !destino || !distancia ||
      !fecha_salida || !hora_salida || !fecha_llegada || !hora_llegada
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const query = `
      INSERT INTO armadoregistro (
        camion, conductor_id, destino, distancia, 
        fecha_salida, hora_salida, fecha_llegada, hora_llegada, 
        carga_id, acompanante_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        camion,
        conductor_id,
        destino,
        distancia,
        fecha_salida,
        hora_salida,
        fecha_llegada,
        hora_llegada,
        carga_id || null,
        acompanante_id || null,
      ],
      (err, result) => {
        if (err) {
          console.error('Error al agregar registro armado:', err.message);
          return res.status(500).json({ error: 'Error al agregar registro armado' });
        }

        res.json({
          id: result.insertId,
          camion,
          conductor_id,
          destino,
          distancia,
          fecha_salida,
          hora_salida,
          fecha_llegada,
          hora_llegada,
          carga_id,
          acompanante_id,
        });
      }
    );
  },

  // Actualizar un registro armado existente
  updateArmadoRegistro: (req, res) => {
    console.log('Datos recibidos para actualizar:', req.body);

    const {
      conductor_id,
      destino,
      distancia,
      hora_salida,
      hora_llegada,
      acompanante_id,
    } = req.body;
    const { id } = req.params;

    const query = `
      UPDATE armadoregistro
      SET conductor_id = ?, destino = ?, distancia = ?, 
          hora_salida = ?, hora_llegada = ?, acompanante_id = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [conductor_id, destino, distancia, hora_salida, hora_llegada, acompanante_id || null, id],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar registro armado:', err.message);
          return res.status(500).json({ error: 'Error al actualizar registro armado' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro actualizado con éxito' });
      }
    );
  },

  // Eliminar un registro armado
  deleteArmadoRegistro: (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM armadoregistro WHERE id = ?';

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error al eliminar registro armado:', err.message);
        return res.status(500).json({ error: 'Error al eliminar registro armado' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json({ message: 'Registro eliminado con éxito' });
    });
  },
};

module.exports = armadoregistroController;
