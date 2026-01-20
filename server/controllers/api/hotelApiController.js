// server/controllers/api/hotelApiController.js
const HotelManager = require("../../models/HotelManager");

// API pour obtenir la liste des hôtels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await HotelManager.findAll();
        // Au lieu de res.render('dashboard', { hotels }), on fait :
        res.json(hotels); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// API pour obtenir le détail d'un hôtel avec ses chambres
exports.getHotelDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await HotelManager.getOneWithRooms(id);
        
        if (!data) {
            return res.status(404).json({ message: "Hôtel introuvable" });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.searchHotels = async (req,res) => {
    try {
        const { city, dateDebut, dateFin, adults, children, piscine, spa, animaux, wifi, parking } = req.query;

        const totalPeople = (parseInt(adults) || 0) + (parseInt(children) || 0);

        const searchParams = {
            lieu: city || null,           // On mappe 'city' (URL) vers 'lieu' (SQL)
            dateDebut: dateDebut || null,
            dateFin: dateFin || null,
            capacite: totalPeople > 0 ? totalPeople : null,
            options: {
                piscine: piscine === 'true',
                spa: spa === 'true',
                animaux: animaux === 'true',
                wifi: wifi === 'true',
                parking: parking === 'true'
            },            
        };

        console.log("Recherche avec :", searchParams); // Debug

        const rawHotels = await HotelManager.getHotelSearch(searchParams);

        if (!rawHotels) {
            return res.status(404).json({ message: "Aucun hôtel ne répond à ces critères." });
        }

        // const hotels = await HotelManager.getHotelSearch(searchParams);

        // MAPPING -> adapter la structure des données pour avoir le champ cover_image à la place de main_image_url
        const hotels = rawHotels.map(hotel => {
            return {
                ...hotel,
                cover_image: hotel.main_image_url
            }
        });

        res.json(hotels);

    } catch (error) {
        console.error("Erreur recherche:", error);
        res.status(500).json({ message: "Erreur lors de la recherche" });
    }
};