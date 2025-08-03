
---

## 📁 Backend – Node.js + Express  
`/README.md`

```markdown
# 🔧 Backend - Gestión de Camiones, Conductores y Cargas

Este backend provee una API REST para manejar los datos de camiones, cargas, conductores, acompañantes y registros generales.

## 🧰 Tecnologías

- Node.js
- Express.js
- MySQL (o SQLite, según preferencia)
- Middleware CORS y JSON
- Librería `mysql2` o `sequelize` (según implementación)

## 📦 Endpoints principales

### 🚛 Camiones
- `GET /camiones` – Listar
- `POST /camiones` – Crear
- `PUT /camiones/:id` – Actualizar
- `DELETE /camiones/:id` – Eliminar

### 👷 Conductores
- `GET /conductores`

### 🤝 Acompañantes
- `GET /acompanantes`

### 📦 Cargas
- `GET /cargas`
- `POST /cargas`
- `PUT /cargas/:id`
- `DELETE /cargas/:id`

### 📄 Registro de viajes
- `POST /armadoregistro`

## ⚙️ Configuración

1. Clonar el repositorio
2. Crear base de datos en MySQL con las tablas necesarias
3. Configurar conexión en `config/db.js` o archivo equivalente

```js
const mysql = require('mysql2');
module.exports = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nombre_basedatos'
});
