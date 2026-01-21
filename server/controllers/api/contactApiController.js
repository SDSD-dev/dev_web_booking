// server/controllers/api/contactApiController.js
const ContactManager = require('../../models/ContactManager');

exports.contact = async (req, res) => {
    try {
        // Récupérer les données du formulaire
        const { nom, prenom, email, phone, message, consent_public } = req.body;
        // Convertir le consentement RGPD en valeur binaire (1 ou 0)
        const valRgpd = (consent_public === true || consent_public === "true" || consent_public === "yes" || consent_public === "1" || consent_public === "on") ? 1 : 0;

        const newMessage = await ContactManager.createMessage({ nom, prenom, email, phone, message, rgpd: valRgpd});

        res.json(newMessage);

    } catch {
        console.error("Erreur de serveur contact:");
        res.status(500).json({message : "Erreur de serveur"});
    }

} 