// server/models/ContactManager.js
const db = require("../config/db");

class ContactManager {
    static async createMessage(contactData) {
    
    // Enregistrer dans la base
    const [result] = await db.execute(
        "INSERT INTO contact (nom, prenom, email, telephone, message, rgpd, date_envoi) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [contactData.nom, contactData.prenom, contactData.email, contactData.phone, contactData.message, contactData.rgpd]
        );
        
    return result;
    };    
}

module.exports = ContactManager;
