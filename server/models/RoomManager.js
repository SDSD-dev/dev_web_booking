// server/models/RoomManager.js
const db = require("../config/db");

class RoomManager {
    static async getRoomsByHotelId(idHotel) {
        const sql = `SELECT chambres.*, (SELECT url_image FROM chambre_images WHERE chambre_id = chambres.id_chambre LIMIT 1) as image_chambre
        FROM chambres WHERE chambres.hotel_id = ?`;
        const [rows] = await db.execute(sql, [idHotel]);
        return rows; // return la liste des chambres de cet hôtel
    }    
}

module.exports = RoomManager;