// server/models/User.js
const db = require("../config/db");

class User {
  // Trouver un utilisateur par son email
  static async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM connexions WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  
  // Trouver les infos perso (table clients) via l'ID de connexion
  static async findProfileById(clientId) {
    const [rows] = await db.execute(
      "SELECT nom, prenom, email, telephone, rue, code_postal, ville, pays FROM clients WHERE id_client = ?",
      [clientId]
    );
    return rows[0];
  }


  // Créer un nouvel utilisateur (Transaction complexe)
  static async create(clientData, authData) {
    const connection = await db.getConnection(); // On prend une connexion du pool
    try {
      await connection.beginTransaction();

      // 1. Insert Client
      const [clientResult] = await connection.execute(
        `INSERT INTO clients (nom, prenom, email, telephone, rue, code_postal, ville, pays) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          clientData.nom,
          clientData.prenom,
          clientData.email,
          clientData.telephone,
          clientData.rue,
          clientData.code_postal,
          clientData.ville,
          clientData.pays,
        ]
      );
      const newClientId = clientResult.insertId;

      // 2. Insert Connexion
      await connection.execute(
        `INSERT INTO connexions (email, mot_de_passe_hash, role, client_id) 
                 VALUES (?, ?, ?, ?)`,
        [authData.email, authData.hash, "client", newClientId]
      );

      await connection.commit();
      return newClientId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release(); // IMPORTANT : Libérer la connexion
    }
  }
}

module.exports = User;
