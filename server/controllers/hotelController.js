// server/controllers/hotelController.js
const HotelManager = require("../models/HotelManager");
const RoomManager = require("../models/RoomManager");

// --- GESTION DE L'AFFICHAGE DES PAGES (GET) ---
exports.viewSearch = async (req, res) => {
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
    
    let viewSearch = {
    title: "Résultats de Recherche",
    subtitle: "Résultats des hôtels disponibles",
    // 2. Initialiser searchList
    searchList: [],
    // searchParams: {} // Pour garder le témoin de recherche
    searchParams: {
            date_debut,
            date_fin,
            adultes,
            enfants,
            lieu // pour revenir en arrière
        }
    };    

    // Vérification des dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date_debut);
    if (date_debut && checkDate < today) {
      return res.render("index", {
        error: "Vous ne pouvez pas réserver dans le passé, Marty McFly !"
      });
    }
    
    // --- LOGIQUE MÉTIER (Calculs) ---

    // Calcul de la capacité (L'assistant fait le calcul ici)
    const capaciteTotale = parseInt(adultes || 0) + parseInt(enfants || 0);

    // Gestion des dates par défaut
    // Si pas de date fournie, on met des bornes très larges
    let start = "1900-01-01";
    let end = "3000-01-01";
    if (date_debut && date_fin) {
      start = date_debut;
      end = date_fin;
    }


    // C'est cet objet 'hotelSearchParams' qui est passé au Manager (HotelManager)
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

    viewSearch.searchParams = {
        date_debut: start, // On renvoie la variable 'start' qui contient la date valide
        date_fin: end,     // On renvoie la variable 'end'
        adultes: adultes || 0,
        enfants: enfants || 0,
        lieu: lieu
    };

    // AFFICHAGE
    console.log(`Résultats trouvés : ${results.length}`);
    res.render("search", viewSearch);
    
  } catch (error) {
    console.error("Erreur lors de la recherche d'hôtels :", error);
    res.status(500).render("search", {
      title: "Erreur de Recherche",
      subtitle: "Une erreur est survenue lors de la recherche d'hôtels.",
      searchList: [],
    });
  };
};

exports.viewHotelDetails = async (req, res) => {
    try {
        const idHotel = req.params.id;
        
        // 1. RÉCUPÉRER LES PARAMÈTRES DE RECHERCHE (Le témoin)
        const { date_debut, date_fin, adultes, enfants } = req.query;

        const hotel = await HotelManager.getOneById(idHotel);
        if (!hotel) return res.status(404).send("Hôtel introuvable");

        const chambres = await RoomManager.getRoomsByHotelId(idHotel);

        res.render("hotel-details", {
            title: hotel.name,
            subtitle: "Chambres Disponibles",
            hotel: hotel,
            chambres: chambres,
            // 2. TRANSMETTRE LE TÉMOIN À LA VUE
            searchParams: {
                date_debut,
                date_fin,
                adultes,
                enfants
            }
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'hôtel :", error);
        res.status(500).send("Erreur serveur");        
    }
};

