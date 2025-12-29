// server/models/RoomManager.js
const db = require("../config/db");

class RoomManager {
    // Récupérer toutes les chambres d'un hôtel par son ID
    static async getRoomsByHotelId(idHotel) {
        const sql = `SELECT chambres.*, (SELECT url_image FROM chambre_images WHERE chambre_id = chambres.id_chambre LIMIT 1) as image_chambre
        FROM chambres 
        WHERE chambres.hotel_id = ?
        `;
        const [rows] = await db.execute(sql, [idHotel]);
        return rows; // return la liste des chambres de cet hôtel
    }
    // Récupérer une chambre par son ID avec les infos de l'hôtel
    static async getOneById(idChambre) {        
        const sql = `SELECT chambres.*, hotel.name as hotel_name, hotel.city, hotel.address
        FROM chambres
        JOIN hotel ON chambres.hotel_id = hotel.id_hotel
        WHERE chambres.id_chambre = ?`;
        const [rows] = await db.execute(sql, [idChambre])
        return rows[0];
    }
}

module.exports = RoomManager;