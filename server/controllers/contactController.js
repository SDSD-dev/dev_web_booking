// server/controllers/contactController.js
const ContactManager = require("../models/ContactManager"); // Importation du modèle

// --- GESTION DE L'AFFICHAGE DES PAGES (GET) ---
exports.viewContact = (req, res) => {
  res.render("contact", { title: "Contactez-moi", subtitle: "Formulaire de contact" });
};

// --- GESTION DES ACTIONS (POST) ---
exports.contact = async (req, res) => {
  try {
    // 1. Récupérer les données du formulaire
    const { nom, prenom, email, phone, message, consent_public } = req.body;
    const valRgpd = (consent_public === "yes" || consent_public === "on") ? 1 : 0; // Syntaxe "simple" pour écrire des IF/ELSE sur une seule ligne

    const newMessage = await ContactManager.createMessage(
      { nom, prenom, email, phone, message, rgpd: valRgpd },
    );

    // Répondre à l'utilisateur
    res.render("contact", { 
    title: "Contact", 
    subtitle: "Succès",
    successMessage: "Merci ! Votre message a bien été envoyé." 
    });
  } catch (error) {
    console.error("Erreur controller contact:", error);
        res.status(500).render("contact", { 
        title: "Contact", 
        subtitle: "Erreur",
        error: "Une erreur est survenue lors de l'envoi." 
        });
  }
};