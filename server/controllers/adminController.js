// server/controllers/adminController.js
const HotelManager = require("../models/HotelManager");

// 1. DASHBOARD (Liste des hôtels)
exports.viewDashboard = async (req, res) => {
    try {
        const hotels = await HotelManager.findAll()
        res.render("admin/dashboard", { 
        title: "Administration",
        subtitle: "Tableau de bord",
        hotels : hotels
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur chargement dashboard");
    }
}

// 2. FORMULAIRE DE CRÉATION
exports.viewAddHotel = async (req, res) => {
    res.render("admin/hotel-form", {
        title: "Ajouter un hôtel",
        subtitle: "Nouvel établissement",
        hotel: null // null car c'est une création (pas une édition)
    });
}

// 3. ACTION DE CRÉATION (POST)
exports.createHotel =  async (req, res) => {
    try {
        const { name, address, city, country, description, piscine, spa, animaux, wifi, parking } = req.body;
        await HotelManager.create({
            name, address, city, country, description, piscine, spa, animaux, wifi, parking,
            user_id: req.session.connexionId // ID de connexion (table connexions)
        });
        res.redirect("/admin/dashboard"); // Retour à la liste
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création de l'hôtel");
    }
}

// 4. ACTION : SUPPRIMER
exports.deleteHotel = async (req, res) => {
    try {
        await HotelManager.delete(req.params.id);
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression");
    }
};

// 5. VUE : FORMULAIRE EN MODE ÉDITION
exports.viewEditHotel = async (req, res) => {
    try {
        const hotel = await HotelManager.getOneById(req.params.id);

        if (!hotel) return res.redirect("/admin/dashboard");

        res.render("admin/hotel-form", {
            title : "Modifier l'hôtel",
            subtitle: `Édition de ${hotel.name}`,
            hotel: hotel // On passe l'objet pour pré-remplir les champs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du chargement du formulaire");
    }
};

// 6. ACTION : SAUVEGARDER LA MODIFICATION
exports.updateHotel = async (req, res) => {
    try {
        const idHotel = req.params.id; 
        await HotelManager.update(idHotel, req.body);
        res.redirect("/admin/dashboard");
    } catch (error) {
        log.error(error);
        res.status(500).send("Erreur chargement formulaire");
    }
};