const db = require('../config/db.js');

const cargaController = {
  createCarga: (req, res) => {
    console.log('Datos recibidos para crear una carga:', req.body);
    const { tipo_carga, peso, marca, producto } = req.body;
    const query =
      'INSERT INTO cargas (tipo_carga, peso, marca, producto) VALUES (?, ?, ?, ?)';
    db.query(query, [tipo_carga, peso, marca, producto], (err, results) => {
      if (err) {
        console.error('Error al insertar carga:', err);
        return res.status(500).send({ error: 'Error al guardar los datos' });
      }
      res.status(200).send({ message: 'Carga guardada exitosamente', id: results.insertId });
    });
  },

  getCarga: (req, res) => {
    console.log('El frontend está pidiendo la carga con ID:', req.params.id);
    const { id } = req.params;
    const query = 'SELECT * FROM cargas WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener la carga:', err);
        return res.status(500).send({ error: 'Error al obtener los datos' });
      }
      if (results.length === 0) {
        return res.status(404).send({ error: 'Carga no encontrada' });
      }
      
      // AQUI: Muestra los datos que se van a devolver ANTES de enviarlos al frontend
      console.log('El backend va a devolver estos datos:', results[0]);
      
      res.status(200).send(results[0]);
    });
  },

  getCargas: (req, res) => {
    const query = 'SELECT * FROM cargas';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener las cargas:', err);
        return res.status(500).send({ error: 'Error al obtener los datos' });
      }
      res.status(200).send(results);
    });
  },

  deleteCarga: (req, res) => {
    console.log('El frontend está pidiendo eliminar la carga con ID:', req.params.id);
    const { id } = req.params;
    const query = 'DELETE FROM cargas WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar carga:', err);
        return res.status(500).send({ error: 'Error al eliminar los datos' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ error: 'Carga no encontrada' });
      }
      res.status(200).send({ message: 'Carga eliminada exitosamente' });
    });
  },

  updateCarga: (req, res) => {
    console.log('El frontend está pidiendo actualizar la carga con ID:', req.params.id);
    console.log('Nuevos datos recibidos para la carga:', req.body);
    const { id } = req.params;
    const { tipoCarga, peso, marca, producto } = req.body;
    const query = `
      UPDATE cargas
      SET tipo_carga = ?, peso = ?, marca = ?, producto = ?
      WHERE id = ?
    `;
    db.query(query, [tipoCarga, peso, marca, producto, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar carga:', err.message);
        return res.status(500).send({ error: 'Error al actualizar carga' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: 'Carga no encontrada' });
      }
      res.json({ message: 'Carga actualizada con éxito' });
    });
  }
};

module.exports = cargaController;