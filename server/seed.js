const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt"); // Nécessaire pour le hachage du mot de passe

const SALT_ROUNDS = 10; // Niveau de complexité du hachage (standard)

// Les fonctions de création de data pour faker.js
function createHotelName() {
  const suffixes = [
    "Inn",
    "Resort",
    "Palace",
    "Lodge",
    "Hôtel",
    "Auberge",
    "Résidence",
  ];
  const nameParts = [
    faker.company.name(),
    faker.person.lastName(),
    faker.location.city(),
  ];
  // Choisir aléatoirement une partie de nom et un suffixe
  const baseName = faker.helpers.arrayElement(nameParts);
  const suffix = faker.helpers.arrayElement(suffixes);

  return `Le ${baseName} ${suffix}`;
}

function createRandomHotel() {
  const CITIES = ["Paris", "Lyon", "Lille", "Bordeaux", "Marseille", "Lourdes"];
  return {
    name: createHotelName(), // Utilisation de la fonction helper
    address: faker.location.streetAddress(), // Plus précis pour une adresse
    // city: faker.location.city(),
    city: faker.helpers.arrayElement(CITIES), // Limité à 5 villes
    country: "France", // Simplification pour le test
    // country: faker.location.country(),
    currency: faker.helpers.arrayElement(["EUR", "USD", "GBP"]), // Ex: 'EUR', 'USD', 'GBP'
    piscine: faker.datatype.boolean(),
    spa: faker.datatype.boolean(),
    animaux: faker.datatype.boolean(),
    wifi: faker.datatype.boolean(),
    front_de_mer: faker.datatype.boolean(),
    description_hotel: faker.lorem.paragraph(5),
  };
}

function createRandomClient() {
  return {
    nom: faker.person.lastName(),
    prenom: faker.person.firstName(),
    // Téléphone format international pour plus de réalisme
    telephone: faker.phone.number("+33 6 ## ## ## ##"),
    email: faker.internet.email(), // email unique
    pays: faker.location.country(),
    ville: faker.location.city(),
    code_postal: faker.location.zipCode("#####"),
    rue: faker.location.streetAddress(),
  };
}

function createRandomConnexions() {
  return {
    // email repris du client associé dans le script de seeding
    mot_de_passe_simple: faker.internet.password(12), // Pour le hachage Bcrypt
    role: faker.helpers.arrayElement([
      "client",
      "administrateur",
      "prestataire",
    ]),
    // client_id sera géré par le script
  };
}

function createRandomChambres() {
  return {
    type_chambre: faker.helpers.arrayElement([
      "Standard",
      "Deluxe",
      "Suite",
      "Familiale",
      "Appartement",
    ]),
    capacite_max: faker.number.int({ min: 1, max: 5 }),
    nombre_total_unites: faker.number.int({ min: 1, max: 100 }),
    prix_base: faker.number.float({ min: 50.0, max: 300.0, precision: 0.01 }),
    prix_enfant_sup: faker.number.float({
      min: 15.0,
      max: 50.0,
      precision: 0.01,
    }),
    description_chambre: faker.lorem.paragraph(2),
    reduction_pourcentage: faker.number.float({
      min: 0.0,
      max: 0.3,
      precision: 0.01,
    }), // Max 30%
    date_fin_promo: faker.date.soon({ days: 120 }), // Promo valable dans les 4 mois
    // hotel_id sera géré par le script
  };
}

// NOTE: Cette fonction simule des commandes passées.
function createRandomCommandes() {
  // 1. Générer la date de début (entre il y a 1 an et dans 2 ans)
  const start = faker.date.future({
    years: 2,
    refDate: faker.date.past({ years: 1 }),
  });

  // 2. Générer la date de fin APRÈS la date de début (+1 à +10 jours)
  const end = faker.date.soon({ days: 10, refDate: start });

  // 3. Générer les autres dates
  const date_commande = faker.date.past({ days: 30, refDate: start });
  const date_reservation = date_commande;
  return {
    date_commande: date_commande.toISOString().split("T")[0],
    date_reservation: date_reservation
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    date_sejour_debut: start.toISOString().split("T")[0],
    date_sejour_fin: end.toISOString().split("T")[0],
    nbr_adulte: faker.number.int({ min: 1, max: 4 }),
    nbr_enfant: faker.number.int({ min: 0, max: 3 }),
    paye: faker.datatype.boolean(),
    montant_total: faker.number.float({
      min: 50.0,
      max: 1500.0,
      precision: 0.01,
    }),
    statut_commande: faker.helpers.arrayElement([
      "confirmée",
      "payée",
      "annulée",
    ]),
    // client_id et hotel_id seront gérés par le script
  };
}

function createRandomLignes_commande() {
  const nbrNuits = faker.number.int({ min: 1, max: 14 }); // 1 à 14 nuits
  const prixUnitaire = faker.number.float({
    min: 50.0,
    max: 300.0,
    precision: 0.01,
  });
  const quantite = faker.number.int({ min: 1, max: 3 });

  return {
    quantite: quantite,
    prix_unitaire_valide: prixUnitaire,
    nbr_nuits: nbrNuits,
    prix_total_ligne: prixUnitaire * nbrNuits * quantite,
    // commande_id et chambre_id seront gérés par le script
  };
}

function createRandomAvis() {
  return {
    avis: faker.lorem.lines(3),
    notes: faker.number.int({ min: 1, max: 5 }),
    date_avis: faker.date.past({ years: 1 }),
    // hotel_id et client_id seront gérés par le script
  };
}

// IMAGES ---------------------------------------------------------------------------

// Le chemin vers le dossier d'images (attention position du seed.js -> normalement dans dossier 'server/' )
const BASE_DIR = path.join(__dirname, "..", "client", "public");

const HOTEL_IMAGES_DIR = path.join(BASE_DIR, "img_hotels");
const ROOM_IMAGES_DIR = path.join(BASE_DIR, "img_rooms");

// Fonction utilitaire pour lire le répertoire d'images
const readImageFiles = (dir) => {
  try {
    // Lit le contenu du dossier et filtre pour ne garder que les images
    return fs
      .readdirSync(dir)
      .filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file));
  } catch (error) {
    console.error(`Erreur: Le répertoire d'images ${dir} n'a pas pu être lu.`);
    return [];
  }
};

const hotelImageFiles = readImageFiles(HOTEL_IMAGES_DIR);
const roomImageFiles = readImageFiles(ROOM_IMAGES_DIR);

// Placez ceci avec vos autres fonctions createRandom...()

function createRandomImage(imageFiles, targetPath, targetId) {
  if (imageFiles.length === 0) {
    return { url_image: null, tag: "Image par défaut", id: targetId };
  }

  // 1. Sélectionner un nom de fichier aléatoire parmi la liste lue
  const randomFileName = faker.helpers.arrayElement(imageFiles);

  // 2. Construire l'URL publique (ex: /img_hotels/nom.jpg)
  const url = `${targetPath}/${randomFileName}`;

  return {
    url_image: url,
    tag: faker.lorem.sentence(3),
    id: targetId, // Utile pour stocker la FK avant l'insertion
  };
}

function createRandomContact() {
  return {
    nom: faker.person.lastName(),
    prenom: faker.person.firstName(),
    email: faker.internet.email(),
    telephone: faker.phone.number(),
    message: faker.lorem.paragraph(),
    rgpd: true, // Toujours vrai pour un message inséré (mais aléatoire pour un test réel)
    date_envoi: faker.date.recent({ days: 60 }),
    statut: faker.helpers.arrayElement(["nouveau", "résolu", "spam"]),
  };
}

async function seedDatabase() {
  // 1. Connexion à la base de données
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log(
    `\n✅ Connexion MySQL établie. Amorçage de la DB: ${process.env.DB_NAME}`
  );

  // --- ÉTAPE 1 : VIDER LES TABLES (Ordre : ENFANT -> PARENT) ---

  // 1. Tables dépendantes d'autres tables (le plus bas niveau)
  await connection.execute("DELETE FROM lignes_commande");
  await connection.execute("DELETE FROM chambre_images"); // <-- NOUVEL ORDRE (avant chambres)
  await connection.execute("DELETE FROM hotel_images"); // <-- NOUVEL ORDRE (avant hotel)
  await connection.execute("DELETE FROM avis");
  await connection.execute("DELETE FROM connexions");
  await connection.execute("DELETE FROM contact"); // Autonome, mais bonne pratique de le vider tôt

  // 2. Tables parentes (qui sont référencées par les tables vidées ci-dessus)
  await connection.execute("DELETE FROM commandes");
  await connection.execute("DELETE FROM chambres");
  await connection.execute("DELETE FROM clients");

  // 3. Tables racines (qui ne dépendent de rien d'autre)
  await connection.execute("DELETE FROM hotel");

  console.log("Tables vidées avec succès.");

  // --- ÉTAPE 2 : INSERTION DES PARENTS (Sans Clés Étrangères) ---

  // 2.1 Insertion des Hôtels
  const hotelsIds = [];
  for (let i = 0; i < 30; i++) {
    const hotelData = createRandomHotel(); // Assurez-vous que cette fonction existe

    const [result] = await connection.execute(
      "INSERT INTO hotel (name, address, city, country, currency, piscine, spa, animaux, wifi, front_de_mer, description_hotel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        hotelData.name,
        hotelData.address,
        hotelData.city,
        hotelData.country,
        hotelData.currency,
        hotelData.piscine,
        hotelData.spa,
        hotelData.animaux,
        hotelData.wifi,
        hotelData.front_de_mer,
        hotelData.description_hotel,
      ]
    );
    hotelsIds.push(result.insertId);
  }
  console.log(`   [+] ${hotelsIds.length} Hôtels insérés.`);

  // --- DANS seedDatabase(), après l'insertion des Hôtels ---

  // Insertion des images d'hôtels (Doit suivre l'insertion des Hôtels)
  console.log(`\n   [+] Amorçage des images d'hôtels...`);
  for (const hotelId of hotelsIds) {
    // Boucle sur TOUS les IDs d'hôtel
    const numImages = faker.number.int({ min: 2, max: 6 });

    for (let i = 0; i < numImages; i++) {
      // Utilisation de la liste des fichiers d'hôtel
      const imageData = createRandomImage(
        hotelImageFiles,
        "/img_hotels",
        hotelId
      );

      await connection.execute(
        "INSERT INTO hotel_images (hotel_id, url_image, tag) VALUES (?, ?, ?)",
        [hotelId, imageData.url_image, imageData.tag]
      );
    }
  }
  console.log(`   [+] Images d'hôtels insérées.`);

  // 2.2 Insertion des Clients et Connexions
  const clientIds = [];
  for (let i = 0; i < 30; i++) {
    const clientData = createRandomClient(); // cf fonction plus haut -> Récupère mot_de_passe_simple et role
    const connexionData = createRandomConnexions(); // cf fonction plus haut -> Récupère mot_de_passe_simple et role

    // 1. Insertion du Client (Parent)
    const [clientResult] = await connection.execute(
      "INSERT INTO clients (nom, prenom, telephone, email, pays, ville, code_postal, rue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        clientData.nom,
        clientData.prenom,
        clientData.telephone,
        clientData.email,
        clientData.pays,
        clientData.ville,
        clientData.code_postal,
        clientData.rue,
      ]
    );
    const newClientId = clientResult.insertId;
    clientIds.push(newClientId);

    // 2. Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(
      connexionData.mot_de_passe_simple,
      SALT_ROUNDS
    );

    // --- ÉTAPE 3 : INSERTION DES ENFANTS (Avec Clés Étrangères) ---

    // 3. Insertion de la Connexion (Enfant, utilise l'ID du Client)
    await connection.execute(
      "INSERT INTO connexions (email, mot_de_passe_hash, role, client_id) VALUES (?, ?, ?, ?)",
      [clientData.email, hashedPassword, connexionData.role, newClientId] // Réutilise le même email et le newClientId
    );
  }
  console.log(`   [+] ${clientIds.length} Clients/Connexions insérés.`);

  // DANS la fonction seedDatabase, après l'insertion des Hôtels (car chambres dépend de hotel)
  // Récupération de l'array hotelsIds
  const chambresIds = [];
  for (let i = 0; i < 60; i++) {
    const chambresData = createRandomChambres();
    const randomHotelId = faker.helpers.arrayElement(hotelsIds); // <-- Ajout de la FK

    const [result] = await connection.execute(
      // CORRECTION 1: Cible la bonne table (chambres)
      "INSERT INTO chambres (type_chambre, capacite_max, nombre_total_unites, prix_base, prix_enfant_sup, description_chambre, reduction_pourcentage, date_fin_promo, hotel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        chambresData.type_chambre,
        chambresData.capacite_max,
        chambresData.nombre_total_unites,
        chambresData.prix_base,
        chambresData.prix_enfant_sup,
        chambresData.description_chambre,
        chambresData.reduction_pourcentage,
        chambresData.date_fin_promo,
        randomHotelId, // <-- Ajout de la clé étrangère
      ]
    );
    chambresIds.push(result.insertId);
  }
  console.log(`   [+] ${chambresIds.length} Types de chambres insérés.`);

  // --- DANS seedDatabase(), après l'insertion des Chambres (qui utilise chambresIds) ---
  // Insertion des images de chambres
  console.log(`\n   [+] Amorçage des images de chambres...`);
  for (const chambreId of chambresIds) {
    // Boucle sur TOUS les IDs de chambres
    const numImages = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numImages; i++) {
      // Utilisation de la liste des fichiers de chambres
      const imageData = createRandomImage(
        roomImageFiles,
        "/img_rooms",
        chambreId
      );

      await connection.execute(
        "INSERT INTO chambre_images (chambre_id, url_image, tag) VALUES (?, ?, ?)",
        [chambreId, imageData.url_image, imageData.tag]
      );
    }
  }
  console.log(`   [+] Images de chambres insérées.`);
  //--

  // Insertion des Avis (Doit suivre l'insertion des Clients et Hôtels)
  for (let i = 0; i < 40; i++) {
    const avisData = createRandomAvis();

    // Sélection d'un client et d'un hôtel aléatoires
    const randomClientId = faker.helpers.arrayElement(clientIds);
    const randomHotelId = faker.helpers.arrayElement(hotelsIds);

    await connection.execute(
      "INSERT INTO avis (avis, notes, date_avis, hotel_id, client_id) VALUES (?, ?, ?, ?, ?)",
      [
        avisData.avis,
        avisData.notes,
        avisData.date_avis,
        randomHotelId,
        randomClientId,
      ]
    );
  }
  console.log(`   [+] 40 Avis insérés.`);

  // Insertion des messages de contact (à faire à la fin, car aucune dépendance)
  for (let i = 0; i < 30; i++) {
    const contactData = createRandomContact();

    const [result] = await connection.execute(
      // CORRECTION 2: Cible la bonne table (contact)
      "INSERT INTO contact (nom, prenom, email, telephone, message, rgpd, date_envoi, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        contactData.nom,
        contactData.prenom,
        contactData.email,
        contactData.telephone,
        contactData.message,
        contactData.rgpd,
        contactData.date_envoi,
        contactData.statut, // Votre code avait 9 paramètres ici pour 8 colonnes SQL, corrigé
      ]
    );
    // Pas besoin de stocker l'ID
  }
  console.log(`   [+] 30 Contacts insérés.`);

  // Insertion des Commandes
  const commandesIds = [];
  for (let i = 0; i < 100; i++) {
    const commandeData = createRandomCommandes(); // Assurez-vous que cette fonction existe

    // Choix aléatoire d'un client et d'un hôtel existants
    const randomClientId = faker.helpers.arrayElement(clientIds);
    const randomHotelId = faker.helpers.arrayElement(hotelsIds);

    // Requête complète pour la table commandes (vous devrez compléter les champs)
    const [commandeResult] = await connection.execute(
      "INSERT INTO commandes (client_id, hotel_id, date_commande, date_reservation, date_sejour_debut, date_sejour_fin, nbr_adulte, nbr_enfant, paye, montant_total, statut_commande) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        randomClientId,
        randomHotelId,
        commandeData.date_commande,
        commandeData.date_reservation,
        commandeData.date_sejour_debut,
        commandeData.date_sejour_fin,
        commandeData.nbr_adulte,
        commandeData.nbr_enfant,
        commandeData.paye,
        commandeData.montant_total,
        commandeData.statut_commande,
      ]
    );
    commandesIds.push(commandeResult.insertId);
  }
  console.log(`   [+] ${commandesIds.length} Commandes insérées.`);

  // --- DANS seedDatabase(), après l'insertion des Commandes et Chambres ---

  console.log(`\n   [+] Amorçage des lignes de commande...`);

  // Nous allons créer 150 lignes de commande pour lier les 100 commandes aux 60 types de chambres
  for (let i = 0; i < 150; i++) {
    const lignes_commandeData = createRandomLignes_commande();

    // Sélection aléatoire d'un ID de commande et de chambre existants
    const randomCommandeId = faker.helpers.arrayElement(commandesIds);
    const randomChambresId = faker.helpers.arrayElement(chambresIds);

    await connection.execute(
      // CORRECTION 1 & 2: Cible la bonne table ET ajoute les clés étrangères dans les colonnes
      "INSERT INTO lignes_commande (commande_id, chambre_id, quantite, prix_unitaire_valide, nbr_nuits, prix_total_ligne) VALUES (?, ?, ?, ?, ?, ?)",
      [
        // CORRECTION 3: L'ordre des valeurs doit correspondre aux colonnes
        randomCommandeId, // FK
        randomChambresId, // FK
        lignes_commandeData.quantite,
        lignes_commandeData.prix_unitaire_valide,
        lignes_commandeData.nbr_nuits,
        lignes_commandeData.prix_total_ligne,
      ]
    );
  }
  console.log(`   [+] 150 Lignes de commande insérées.`);
  //--

  // Fermeture de la connexion
  await connection.end();
  console.log("\n✨ Base de données amorcée avec succès !");
}

// Lancement de la fonction d'amorçage
seedDatabase().catch((err) => {
  console.error("\n❌ Erreur d'amorçage:", err);
  process.exit(1);
});
