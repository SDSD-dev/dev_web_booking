// server/controllers/authController.js
const bcrypt = require("bcrypt"); // Nécessaire pour le hachage du mot de passe
const UserManager = require("../models/UserManager");
const OrderManager = require("../models/OrderManager");


// --- GESTION DE L'AFFICHAGE DES PAGES (GET) ---
// Afficher la page d'inscription -> render register.ejs
exports.viewRegister = (req, res) => {
  res.render("register", { title: "Inscription", subtitle: "Créer un compte" });
};

// Afficher la page de connexion -> render login.ejs
exports.viewLogin = (req, res) => {
  res.render("login", { title: "Connexion", subtitle: "Accéder à mon compte" });
};

// Afficher le profil utilisateur -> render profile.ejs
exports.viewProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    // Récupérer les infos perso via le UserManager
    const clientProfile = await UserManager.findProfileById(userId);

    // Récupérer l'historique des commandes
    const reservationsList = await OrderManager.getHistoryByClientId(userId);

    res.render("profile", {
      title: "Mon Profil",
      subtitle: "Infos personnelles",
      clientProfil: clientProfile,
      reservations: reservationsList,
      user: { role: req.session.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur chargement profil");
  }
};

// --- GESTION DES ACTIONS (POST) ---
// Gérer l'inscription
exports.register = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      rue,
      code_postal,
      ville,
      pays,
      mot_de_passe,
    } = req.body;

    // Vérification si email existe déjà
    const existingUser = await UserManager.findByEmail(email);
    if (existingUser) {
      return res.render("register", {
        title: "Inscription",
        subtitle: "Erreur",
        error: "Cet email est déjà utilisé. Veuillez vous connecter.",
      });
    }

    // Hashage
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Appel au Modèle pour créer
    const newClientId = await UserManager.create(
      { nom, prenom, email, telephone, rue, code_postal, ville, pays }, // Infos Client
      { email, hash: hashedPassword } // Infos Auth
    );

    // Auto-login (Session)
    req.session.userId = newClientId;
    req.session.isLoggedIn = true;

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.render("register", {
      title: "Inscription",
      subtitle: "Erreur",
      error: "Erreur inscription",
    });
  }
};

// Gérer la connexion
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // 1. Chercher l'user
    const user = await UserManager.findByEmail(email);
    if (!user)
      return res.render("login", {
        title: "Connexion",
        subtitle: "Erreur",
        error: "Email inconnu",
      });

    // 2. Vérifier mot de passe
    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);
    if (!match)
      return res.render("login", {
        title: "Connexion",
        subtitle: "Mot de passe incorrect",
        error: "Mot de passe incorrect",
      });

    // 3. Session
    // ID pour la table clients
    req.session.userId = user.client_id;
    // ID pour l'administration (table connexions) -> pour la table 'hotel' !
    req.session.connexionId = user.id_connexion;
    // Rôle de l'utilisateur
    req.session.isLoggedIn = true;
    req.session.role = user.role;

    console.log(`Utilisateur connecté : ${user.email} (Rôle: ${user.role})`)

    if (user.role === 'administrateur') {
      // Si Admin, direction le Back-Office
      return res.redirect('/admin/dashboard');
    } else {
      // Sinon, direction Profil
      return res.redirect('/profile');
    }

    // res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

// Gérer la déconnexion
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
