// Importation des modules -------------------------------------------------------
require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./config/db"); // Importation de la configuration de la BD
// express-session pour la gestion des sessions utilisateur
const session = require("express-session");


// création de la constante app -> express() est une fonction
const app = express();

// Configuration de la session (La mémoire du serveur)
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Clé secrète pour signer la session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false , sameSite: 'lax' }, // Mettre 'true' si passage en HTTPS
  })
);

// Middleware pour rendre l'utilisateur disponible dans TOUTES les vues EJS
app.use((req, res, next) => {
    // Activation de la session si l'utilisateur est connecté
    if (req.session.userId) {
        // variable 'user' accessible partout
        res.locals.user = {
            id: req.session.userId,
            role: req.session.userRole
        };
    } else {
        // Sinon, 'user' vaut null
        res.locals.user = null;
    }    
    
    next();
});

// Middleware pour parser les données du formulaire ------------------------------------------

// IMPORTANT : Permettre à Express de lire le JSON (Pour Angular)
app.use(express.json());
// express.urlencoded(...) : Il permet de parser (analyser) les données envoyées dans le corps d’une requête HTTP POST (souvent via un formulaire).
// { extended: true } : Indique comment parser les objets imbriqués dans les données du formulaire.
app.use(express.urlencoded({ extended: true }));

// Chemin pour les fichiers statiques
app.use(express.static(path.join(__dirname, "../server/public")));

// Permet d'accéder aux fichiers statiques via /public (ex: /public/css/style.css)
app.use('/public', express.static('public'));

// Configurer EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ****************************************************
// ****************************************************

// --- IMPORT DES ROUTES ---
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
// Import routes API
const hotelApiRoutes = require('./routes/api/hotelRoutes');
const authApiRoutes = require('./routes/api/authRoutes');
const profileApiRoutes = require('./routes/api/profileRoutes');
const roomApiRoutes = require('./routes/api/roomRoutes');
const bookingApiRoutes = require('./routes/api/bookingRoutes');
const contactApiController = require('./routes/api/contactRoutes')

// --- UTILISATION DES ROUTES ---
app.use("/", authRoutes); // Pour login, register, profile
app.use("/", contactRoutes); // Pour /contact (GET et POST)
app.use("/", hotelRoutes); // Pour /search (GET)
app.use("/", bookingRoutes); // Pour /bookingRoutes (GET)
app.use("/admin", adminRoutes); // Pour /adminRoutes (GET)

// --- ROUTES API (JSON) ---
app.use('/api', hotelApiRoutes); // Pour /api/hotels et /api/hotels/:id
app.use('/api/auth', authApiRoutes); // Pour login, register, profile en API
app.use('/api/profile', profileApiRoutes); // Pour /api/profile
app.use('/api/rooms', roomApiRoutes); // Pour /api/rooms
app.use('/api/booking', bookingApiRoutes); // Pour /api/booking
app.use('/api/contact', contactApiController); // Pour /api/contact (POST)

// ****************************************************
// ****************************************************

// --- Route principale pour la Home Page -------------------------------------------------------
app.get("/", async (req, res) => {

  // Initialiser les données pour garantir que la variable existe toujours
  let viewData = {
    title: "Bienvenue sur notre site de réservation !",
    subtitle: "Accueil",
    content:
      "Ceci est un contenu dynamique provenant d'un objet, avec la key 'content'.",
    imageName: "2025-11-21-1019_0_Original_resultat.jpg",
    // Initialiser hotelsList pour garantir qu'elle existe toujours
    hotelsList: [],
  };

  res.render("index", viewData);
});


// Version avec module.exports pour les tests avec Supertest
if (require.main === module) {
  // Si le fichier est lancé directement (node server.js), on démarre le serveur
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

// Export de l'app pour que Supertest puisse l'utiliser
module.exports = app;
