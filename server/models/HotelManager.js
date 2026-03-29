// server/models/HotelManager.js
const db = require("../config/db");

class HotelManager {
  // Recherche d'hôtels selon des critères
  static async getHotelSearch(hotelSearchParams) {
    const { lieu, dateDebut, dateFin, capacite, options } = hotelSearchParams;

    // let connection;
    const params = [];

    let sql = `
      SELECT 
        T1.*, T2.type_chambre, T2.prix_base, T2.capacite_max,
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
        WHERE C.date_sejour_debut <= ? AND C.date_sejour_fin >= ? AND C.statut_commande != 'annulée'
      )`;

    // INJECTION DES DATES (fournies par le contrôleur)
    // Attention à l'ordre inversé pour la logique de chevauchement
    params.push(dateFin);
    params.push(dateDebut);

    // CONSTRUCTION DYNAMIQUE DU SQL
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

    // Trie des résultats par prix de base croissant (du moins cher au plus cher)
    sql += ` ORDER BY T2.prix_base ASC`;

    // EXÉCUTION
    // On utilise une Map pour éviter les doublons d'hôtels (un hôtel peut avoir plusieurs types de chambres)
    try {
      const [rows] = await db.execute(sql, params);
    
      const hotelsMap = new Map();
      
      rows.forEach(row => {
      // On compte le nombre de types de chambres par hôtel
        if (!hotelsMap.has(row.id_hotel)) {

          // Premier type de chambre pour cet hôtel
          // On crée une copie de l'objet row pour éviter les références partagées
          const cleanHotel = {
            ...row,
            nb_types_chambres: 1
          };
          hotelsMap.set(row.id_hotel, cleanHotel)
        } else {
          // Hôtel déjà vu, on incrémente son compteur
          const existingHotel = hotelsMap.get(row.id_hotel);
          // On incrémente le nombre de types de chambres
          if (typeof existingHotel.nb_types_chambres !== 'number') {
            existingHotel.nb_types_chambres = 0;
          }
          existingHotel.nb_types_chambres += 1;
        }
      });

    return Array.from(hotelsMap.values());
    } catch (error) {
      throw error; // On renvoie l'erreur au contrôleur pour qu'il la gère
    }

  };

  // Récupérer un hôtel par son ID
  static async getOneById(idHotel) {
    // Récupérations des infos de l'hôtel + images + note moyenne
    const sql = `SELECT hotel.*,
    (SELECT AVG(note) FROM avis WHERE hotel_id = hotel.id_hotel) as note_moyenne,
    (SELECT COUNT(*) FROM avis WHERE hotel_id = hotel.id_hotel) as nb_avis,
    (SELECT url_image FROM hotel_images WHERE hotel_id = hotel.id_hotel LIMIT 1) as cover_image
    FROM hotel
    WHERE hotel.id_hotel = ?`;
    const [rows] = await db.execute(sql, [idHotel]);
    return rows[0]; // return un objet unique (indice 0) et non un tableau
  };
  
  // Récupérer un hôtel avec ses chambres
  static async getOneWithRooms(id, dateDebut = null, dateFin = null) {
      const hotel = await this.getOneById(id);

      if (!hotel) return null;

      let sqlRooms = `SELECT chambres.*, 
      (SELECT url_image FROM chambre_images WHERE chambre_id = chambres.id_chambre LIMIT 1) as image_room
      FROM chambres
      WHERE chambres.hotel_id = ?`;

      const params = [id];

      // Si on a des dates, on filtre les chambres déjà réservées pour cette période
      if (dateDebut && dateFin) {
        sqlRooms += ` AND chambres.id_chambre NOT IN (
          SELECT LC.chambre_id 
          FROM lignes_commande AS LC 
          JOIN commandes AS C ON LC.commande_id = C.id_commande 
          WHERE C.date_sejour_debut <= ? AND C.date_sejour_fin >= ? AND C.statut_commande != 'annulée'
        )`;
        // Attention à l'ordre croisé des dates pour tester le chevauchement
        params.push(dateFin);
        params.push(dateDebut);
      }

      const [chambres] = await db.execute(sqlRooms, params);

      return {
          hotel: hotel,
          chambres: chambres
      };
    };


  // Récupérer tous les hôtels (avec image de couverture)
static async findAll() {
    const sql = `SELECT 
      hotel.*, 
      (SELECT url_image FROM hotel_images WHERE hotel_id = hotel.id_hotel LIMIT 1) as cover_image,
      (SELECT MIN(prix_base) FROM chambres WHERE hotel_id = hotel.id_hotel) as prix_base,
      (SELECT AVG(note) FROM avis WHERE hotel_id = hotel.id_hotel) as average_rating,
      (SELECT COUNT(*) FROM avis WHERE hotel_id = hotel.id_hotel) as review_count
    FROM hotel 
    ORDER BY hotel.id_hotel DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  };

  // Créer un nouvel hôtel
  static async create(data) {
    const sql = `
            INSERT INTO hotel (
                name, address, city, country, description_hotel, piscine, spa, animaux, wifi, parking, currency, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EUR', ?)
        `;
    const [result] = await db.execute(sql, [
      data.name, 
      data.address, 
      data.city, 
      data.country, 
      data.description,
      data.piscine ? 1 : 0,
      data.spa ? 1 : 0,
      data.animaux ? 1 : 0,
      data.wifi ? 1 : 0,
      data.parking ? 1 : 0,
      data.user_id
    ]);
    return result.insertId;
  };

  // Supprimer un hôtel
  static async delete(id) {
    const sql = `DELETE FROM hotel WHERE id_hotel = ?`;
    await db.execute(sql, [id])
  };

  // Mettre à jour un hôtel
  static async update(id, data) {
    const sql = `UPDATE hotel SET 
        name = ?, address = ?, city = ?, country = ?, description_hotel = ?, piscine = ?, spa = ?, animaux = ?, wifi = ?, parking = ?
        WHERE id_hotel = ?    
        `;
    await db.execute(sql,[
      data.name, 
      data.address, 
      data.city, 
      data.country, 
      data.description,
      data.piscine ? 1 : 0,
      data.spa ? 1 : 0,
      data.animaux ? 1 : 0,
      data.wifi ? 1 : 0,
      data.parking ? 1 : 0,
      id
    ]);
  };
  
  // Ajouter une image à un hôtel
  static async addImage(hotelId, url) {
    const sql = "INSERT INTO hotel_images (hotel_id, url_image) VALUES (?,?)";
    await db.execute(sql, [hotelId, url])
  };
  
}
module.exports = HotelManager;
