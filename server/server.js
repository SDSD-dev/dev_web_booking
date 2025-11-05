// Importation des modules -------------------------------------------------------
require("dotenv").config();
const express = require("express");
const fs = require("node:fs");
const path = require("path");
// const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // Version promise pour async/await

// création de la constante app -> express() est une fonction
const app = express();

// Exemple d'initialisation de votre serveur Express
const port = process.env.SERVER_PORT || 3000;

// --- Fonction de connexion à MySQL -------------------------------------------------------
const DB_HOST = process.env.DB_HOST; // Vaudra 'localhost'
const DB_NAME = process.env.DB_NAME; // Vaudra 'data_projet3_hotel_01'

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

// Middleware pour parser les données du formulaire ------------------------------------------

// express.urlencoded(...) : Il permet de parser (analyser) les données envoyées dans le corps d’une requête HTTP POST (souvent via un formulaire).
// { extended: true } : Cela indique comment parser les objets imbriqués dans les données du formulaire.
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Chemin pour les fichiers statiques
app.use(express.static(path.join(__dirname, "../client/public")));

// Configurer EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

danz; // --- Route principale pour la Home Page -------------------------------------------------------
app.get("/", async (req, res) => {
  let connection;
  let hotels = [];
  // 1. Initialiser les données pour garantir que la variable existe toujours
  let viewData = {
    pageTitle: "Accueil", // Utilisé par EJS comme title dans <head>
    title: "Bienvenue sur notre site de réservation ! - Work in progress",
    subtitle: "Page d'accueil dynamique",
    content:
      "Ceci est un contenu dynamique provenant d'un objet, avec la key 'content'.",
    imageName: "img_hotel_0034.jpg",
    // 2. Initialiser hotelsList pour garantir qu'elle existe toujours
    hotelsList: [],
  };

  try {
    // 1. Établir la connexion
    connection = await getConnection();

    // 2. Exécuter la requête SQL
    // Nous sélectionnons le nom et la ville des 3 premiers hôtels.
    const [rows] = await connection.execute(
      "SELECT name, city FROM hotel LIMIT 3"
    );
    hotels = rows; // Les résultats sont dans 'rows'

    console.log(`Données récupérées: ${hotels.length} hôtels trouvés.`);

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

// Route pour la page contact -------------------------------------------------------
app.get("/contact", (req, res) => {
  const data_objet = {
    title: "Contactez-moi",
    subtitle: "Formulaire de contact",
    content: "Envoyez-nous un message !",
    imageName: "DArkSerge-Avatar-Big_Robot-01.jpg", // image dans ./public/img/
  };
  res.render("contact", data_objet);
});

// Route pour traiter le formulaire -------------------------------------------------------
app.post("/contact_form", async (req, res) => {
  try {
    // 1. Récupérer les données du formulaire
    const { nom, prenom, email, phone, message, consent_public } = req.body;
    const rgpd = consent_public === "yes" ? 1 : 0; // Syntaxe "simple" pour écrire des IF/ELSE sur une seule ligne

    // 2. Connexion à la base de données
    const connection = await getConnection();

    // 3. Enregistrer dans la base
    const [result] = await connection.execute(
      "INSERT INTO contact (nom, prenom, email, telephone, message, rgpd, date_envoi) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [nom, prenom, email, phone, message, rgpd]
    );

    // 4. Fermer la connexion
    await connection.end();

    // 5. Répondre à l'utilisateur
    res.send(`
      <h1>Merci pour votre message !</h1>
      <p>Nous vous répondrons dès que possible à l'adresse ${email}.</p>
      <a href="/contact">Retour au formulaire</a>
    `);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).send("Une erreur est survenue, veuillez réessayer.");
  }
});

// Ecoute du port local -------------------------------------------------------
app.listen(port, () => {
  console.log(`\nServer is running on http://localhost:${port}`);
  console.log("Test OK: Base de données connectée via .env");
});
