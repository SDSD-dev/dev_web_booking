// server/models/HotelManager.js
const db = require("../config/db");

class HotelManager {
  static async getHotelSearch(hotelSearchParams) {
    const { lieu, dateDebut, dateFin, capacite, options } = hotelSearchParams;

    // let connection;
    const params = [];

    let sql = `
    SELECT 
        T1.name, T1.city, T2.type_chambre, T2.prix_base, T2.capacite_max, T1.id_hotel,
        (SELECT url_image FROM hotel_images WHERE hotel_id = T1.id_hotel ORDER BY id_image LIMIT 1) AS main_image_url,
        (SELECT AVG(note) FROM avis WHERE hotel_id = T1.id_hotel) AS average_rating,
        (SELECT COUNT(*) FROM avis WHERE hotel_id = T1.id_hotel) AS review_count
      FROM hotel AS T1
      JOIN chambres AS T2 ON T1.id_hotel = T2.hotel_id
      WHERE 1=1
      AND T2.id_chambre NOT IN (
        SELECT LC.chambre_id 
        FROM lignes_commande AS LC 
        JOIN commandes AS C ON LC.commande_id = C.id_commande 
        WHERE C.date_sejour_debut <= ? AND C.date_sejour_fin >= ?
      )`;

    // 2. INJECTION DES DATES (fournies par le contrôleur)
    // Attention à l'ordre inversé pour la logique de chevauchement
    params.push(dateFin);
    params.push(dateDebut);

    // 3. CONSTRUCTION DYNAMIQUE DU SQL
    // Filtre Lieu
    if (lieu) {
      sql += ` AND (T1.city LIKE ? OR T1.country LIKE ?)`;
      params.push(`%${lieu}%`, `%${lieu}%`);
    }

    // Filtre Capacité (déjà calculé par le contrôleur)
    if (capacite > 0) {
      sql += ` AND T2.capacite_max >= ?`;
      params.push(capacite);
    }

    // Filtres Options (On regarde dans l'objet 'options')
    if (options.piscine) sql += ` AND T1.piscine = TRUE`;
    if (options.spa) sql += ` AND T1.spa = TRUE`;
    if (options.animaux) sql += ` AND T1.animaux = TRUE`;
    if (options.wifi) sql += ` AND T1.wifi = TRUE`;
    if (options.parking) sql += ` AND T1.parking = TRUE`;



    // 4. EXÉCUTION
    // On utilise db.execute directement (pas besoin de getConnection/release avec mysql2 pool simple)
    try {
      const [rows] = await db.execute(sql, params);
    
      const uniqueHotels = [];
      // Un Set est comme une liste, mais qui ne peut contenir aucun doublon !!!!
      const seen = new Set();

      // On parcourt toutes les lignes retournées par la requête
      rows.forEach(row => {
        // Si on n'a pas encore vu cet id_hotel, on l'ajoute
        if (!seen.has(row.id_hotel)) {
          // On l'ajoute au Set des id déjà vus
          seen.add(row.id_hotel);
          // On l'ajoute au tableau des résultats uniques
          uniqueHotels.push(row);
        }
      });
      
      return uniqueHotels;
    } catch (error) {
      throw error; // On renvoie l'erreur au contrôleur pour qu'il la gère
    }
  };
  static async getOneById(idHotel) {
    // Récupèrations des infos de l'hôtel + images + note moyenne
    const sql = `SELECT hotel.*,
    (SELECT AVG(note) FROM avis WHERE hotel_id = hotel.id_hotel) as note_moyenne,
    (SELECT COUNT(*) FROM avis WHERE hotel_id = hotel.id_hotel) as nb_avis
    FROM hotel
    WHERE hotel.id_hotel = ?`;
    const [rows] = await db.execute(sql, [idHotel]);
    return rows[0]; // return un objet unique (indice 0) et non un tableau
  };
}

module.exports = HotelManager;
