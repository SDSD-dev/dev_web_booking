// server/models/UserManager.js
const db = require("../config/db");

class UserManager {
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

      // Insert Client
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

      // Insert Connexion
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

  // Récupérer les infos d'un client par son ID
  static async getById(id) {
      const sql = "SELECT * FROM clients WHERE id_client = ?";
      const [rows] = await db.execute(sql, [id]);
      return rows[0];
  }

  // Mettre à jour les infos personnelles
  static async update(id, data) {
      const sql = `
          UPDATE clients SET 
          nom = ?, prenom = ?, telephone = ?, 
          rue = ?, code_postal = ?, ville = ?, pays = ?
          WHERE id_client = ?
      `;
      await db.execute(sql, [
          data.nom, 
          data.prenom, 
          data.telephone,
          data.rue, 
          data.code_postal, 
          data.ville, 
          data.pays,
          id
      ]);
  }

  // Récupération du mot de passe 
  static async getPasswordById(userId) {
    const [users] = await db.execute('SELECT mot_de_passe_hash FROM connexions WHERE client_id = ?', [userId]);
    // si utilisateur trouvé
    return users.length > 0 ? users[0].mot_de_passe_hash : null;
  }

  // Mise à jour du mot de passe
  static async updatePassword(userId, newHashedPassword) {
    const [result] = await db.execute('UPDATE connexions SET mot_de_passe_hash = ? WHERE client_id = ?', [newHashedPassword, userId]);
    return result;
  }

}

module.exports = UserManager;
