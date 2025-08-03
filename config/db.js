
const mysql = require('mysql');

const db = mysql.createConnection({
  host: '',
  user: '',
  password: 123,
  database: 
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = db;