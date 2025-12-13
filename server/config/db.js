// configuration de la base de donnée -> server/config/db.js
require("dotenv").config(); // charge les variables du .env
const mysql = require("mysql2");

// création du pool -> pour faire du multi-connection simultannée
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Max de connexions simultanées
  queueLimit: 0,
});

// exportation de la promesse : pool
module.exports = pool.promise();
