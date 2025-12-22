// Importation des modules -------------------------------------------------------
// Using CommonJS require (Node.js default)
const http = require("http");
require("dotenv").config();
const express = require("express");
const fs = require("node:fs");
const path = require("path");
const mysql = require("mysql2/promise"); // Version promise pour async/await
// express-session pour la gestion des sessions utilisateur
const session = require("express-session");
const { subtle } = require("node:crypto");

// création de la constante app -> express() est une fonction
const app = express();

// Initialisation de votre serveur Express
// const port = process.env.SERVER_PORT || 3000;

// --- Fonction de connexion à MySQL -------------------------------------------------------
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

console.log(
  `Tentative de connexion à la base de données: ${DB_NAME} sur l'hôte ${DB_HOST}`
);

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

// Configuration de la session (La mémoire du serveur)
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Clé secrète pour signer le cookie de session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Mettre 'true' si passage en HTTPS
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

// express.urlencoded(...) : Il permet de parser (analyser) les données envoyées dans le corps d’une requête HTTP POST (souvent via un formulaire).
// { extended: true } : Indique comment parser les objets imbriqués dans les données du formulaire.
app.use(express.urlencoded({ extended: true }));

// Chemin pour les fichiers statiques
app.use(express.static(path.join(__dirname, "../server/public")));

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

// --- UTILISATION DES ROUTES ---
app.use("/", authRoutes); // Pour login, register, profile
app.use("/", contactRoutes); // Pour /contact (GET et POST)
app.use("/", hotelRoutes); // Pour /search (GET)
app.use("/", bookingRoutes); // Pour /bookingRoutes (GET)

// ****************************************************
// ****************************************************

// --- Route principale pour la Home Page -------------------------------------------------------
app.get("/", async (req, res) => {
  let connection;
  let hotels = [];
  // 1. Initialiser les données pour garantir que la variable existe toujours
  let viewData = {
    title: "Bienvenue sur notre site de réservation ! - Work in progress",
    subtitle: "Accueil",
    content:
      "Ceci est un contenu dynamique provenant d'un objet, avec la key 'content'.",
    imageName: "2025-11-21-1019_0_Original_resultat.jpg",
    // 2. Initialiser hotelsList pour garantir qu'elle existe toujours
    hotelsList: [],
  };

  try {
    // 1. Établir la connexion
    connection = await getConnection();

    // 2. Exécuter la requête SQL
    // Nous sélectionnons le nom et la ville des 3 premiers hôtels.
    const [rows] = await connection.execute(
      "SELECT name, city FROM hotel LIMIT 4"
    );
    hotels = rows; // Les résultats sont dans 'rows'

    console.log(`Données récupérées: ${hotels.length} hôtels trouvés.`);
    console.log(hotels);

    // 3. Rendre la vue EJS avec les données
    viewData.hotelsList = rows;

    console.log(
      `Données récupérées: ${viewData.hotelsList.length} hôtels trouvés.`
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    viewData.pageTitle = "Erreur de Base de Données";
    // Si ça plante ici, hotelsList reste [] (tableau vide), ce qui est correct.
  } finally {
    // 4. Fermer la connexion pour libérer les ressources
    if (connection) {
      await connection.end();
    }
    res.render("index", viewData);
  }
});


// Ecoute du port local -------------------------------------------------------
// Version avec async/await pour s'assurer que la connexion à la BD est OK avant de démarrer le serveur
// version de base sans les tests
// app.listen(port, () => {
//   console.log(`\nServer is running on http://localhost:${port}`);
//   console.log("Test OK: Base de données connectée via .env");
// });

// Version avec module.exports pour les tests avec Supertest
if (require.main === module) {
  // Si le fichier est lancé directement (node server.js), on démarre le serveur
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

// On exporte l'app pour que Supertest puisse l'utiliser
module.exports = app;
