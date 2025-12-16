// server/controllers/hotelController.js
const HotelManager = require("../models/HotelManager");
const RoomManager = require("../models/RoomManager");

// --- GESTION DE L'AFFICHAGE DES PAGES (GET) ---
exports.viewSearch = async (req, res) => {
  let viewSearch = {
    title: "Résultats de Recherche",
    subtitle: "Résultats des hôtels disponibles",
    // 2. Initialiser searchList
    searchList: [],
  };

  try {
    // 2. Récupérer les données BRUTES du formulaire
    const {
      lieu,
      date_debut,
      date_fin,
      adultes,
      enfants,
      piscine,
      spa,
      animaux,
      wifi,
      parking,
    } = req.query;

    // --- LOGIQUE MÉTIER (Calculs) ---

    // A. Calcul de la capacité (L'assistant fait le calcul ici)
    const capaciteTotale = parseInt(adultes || 0) + parseInt(enfants || 0);

    // B. Gestion des dates par défaut
    // On prépare les valeurs finales à envoyer au Modèle
    let start = "1900-01-01";
    let end = "3000-01-01";
    if (date_debut && date_fin) {
      start = date_debut;
      end = date_fin;
    }

    // 3. CRÉATION DU "DOSSIER CRITÈRES" (L'objet propre)
    // C'est cet objet 'criteres' qui est passé au Manager
    const hotelSearchParams = {
      lieu: lieu, // Peut être undefined
      dateDebut: start, // A une valeur sûre
      dateFin: end, // A une valeur sûre
      capacite: capaciteTotale, // Est un nombre
      // On regroupe les options
      options: {
        piscine: piscine, // Sera 'true', 'on' ou undefined
        spa: spa,
        animaux: animaux,
        wifi: wifi,
        parking: parking,
      },
    };

    const results = await HotelManager.getHotelSearch(hotelSearchParams);

    viewSearch.searchList = results;

    // 6. AFFICHAGE
    console.log(`Résultats trouvés : ${results.length}`);
    res.render("search", viewSearch);
  } catch (error) {
    console.error("Erreur lors de la recherche d'hôtels :", error);
    res.status(500).render("search", {
      title: "Erreur de Recherche",
      content: "Une erreur est survenue lors de la recherche d'hôtels.",
      searchList: [],
    });
  };
};
exports.viewHotelDetails = async (req, res) => {
  try {
    const idHotel = req.params.id; // Récupérer l'ID de l'hôtel depuis les paramètres de l'URL
    // Récupération des infos de l'hôtel (En-tête de page)
    const hotel = await HotelManager.getOneById(idHotel);
    if (!hotel) {
      return res.status(404).send("Hôtel introuvable");
    }
    // Récupération des chambres de l'hôtel
    const chambres = await RoomManager.getRoomsByHotelId(idHotel);
    //la vue
    res.render("hotel-details", {
      title: hotel.name,
      subtitle: "Chambres Disponibles",
      hotel: hotel, // Infos de l'hôtel
      chambres: chambres, // Liste des chambres de l'hôtel disponibles
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'hôtel :",
      error
    );
    res.status(500).send("Erreur serveur");
  };
};
