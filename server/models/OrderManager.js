// server/models/OrderManager.js
const db = require("../config/db");

class OrderManager {
    static async createOrder(orderData) {
        // 1. Obtenir une connexion dédiée (pas le pool générique) !!!!
        const connection = await db.getConnection();

        try {
            // 2. Démarrer la transaction
            await connection.beginTransaction();

            // --- VÉRIFICATION Anti-Doublon ---
            const sqlCheck = `
                SELECT COUNT(*) as count 
                FROM lignes_commande
                JOIN commandes ON lignes_commande.commande_id = commandes.id_commande
                WHERE lignes_commande.chambre_id = ? 
                AND commandes.statut_commande != 'annulee'
                AND (
                    (commandes.date_sejour_debut < ? AND commandes.date_sejour_fin > ?)
                )
            `;
            const [rows] = await connection.execute(sqlCheck, [
                orderData.chambre_id,
                orderData.date_fin,   // Fin de la NOUVELLE demande
                orderData.date_debut  // Début de la NOUVELLE demande
            ]);
            if (rows[0].count >0) {
                // Il existe une réservation
                throw new Error("ROOM_ALREADY_BOOKED")
            }                

            // --- A. INSERTION DANS 'COMMANDES' ---
            const sqlCommande = `
            INSERT INTO commandes (client_id, hotel_id, date_sejour_debut, date_sejour_fin, 
                    nbr_adulte, nbr_enfant, montant_total, statut_commande)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmee')
            `;
            // On met 1 adulte 0 enfant si non précisé,
            const [resultCmd] = await connection.execute(sqlCommande, [
                orderData.client_id,
                orderData.hotel_id,
                orderData.date_debut,
                orderData.date_fin,
                1,
                0,
                orderData.prix_total
            ]);

            const newOrderId = resultCmd.insertId; // Récupération de l'ID de la commande créée !

            // --- INSERTION DANS 'LIGNES_COMMANDE' ---
            const sqlLigne = `
                INSERT INTO lignes_commande (commande_id, chambre_id, quantite, 
                    prix_unitaire_facture, nbr_nuits, prix_total_ligne) 
                    VALUES (?, ?, 1, ?, ?, ?)
                `;
            
            await connection.execute(sqlLigne,[
                newOrderId,
                orderData.chambre_id,
                orderData.prix_unitaire,
                orderData.nbr_nuits,
                orderData.prix_total
            ]);
            
            // 3. Valider la transaction
            await connection.commit();

            console.log(`Commande créée avec succès : ID ${newOrderId}`);
            return newOrderId;
        
        } catch (error) {
            // 4. En cas d'erreur : ANNULER TOUT
            await connection.rollback();
            throw error;
        } finally {
            // 5. Libérer la connexion pour les autres
            connection.release();
        }
    };
    static async getHistoryByClientId(clientId) {
        const sql = `
        SELECT
            commandes.id_commande, 
            commandes.date_commande, 
            commandes.date_sejour_debut, 
            commandes.date_sejour_fin, 
            commandes.montant_total, 
            commandes.statut_commande,
            hotel.name AS hotel_name, 
            hotel.city AS hotel_city,
            hotel.id_hotel
        FROM commandes
        JOIN hotel ON commandes.hotel_id = hotel.id_hotel
        WHERE commandes.client_id = ?
        ORDER BY commandes.date_commande DESC
        `;
        const [rows] = await db.execute(sql, [clientId]);
        return rows;
    }
}

module.exports = OrderManager;