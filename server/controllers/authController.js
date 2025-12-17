// server/controllers/authController.js
const bcrypt = require("bcrypt"); // Nécessaire pour le hachage du mot de passe
const UserManager = require("../models/UserManager"); // Importation du modèle

// --- GESTION DE L'AFFICHAGE DES PAGES (GET) ---

exports.viewRegister = (req, res) => {
  res.render("register", { title: "Inscription", subtitle: "Créer un compte" });
};

exports.viewLogin = (req, res) => {
  res.render("login", { title: "Connexion", subtitle: "Accéder à mon compte" });
};

exports.viewProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const clientProfile = await UserManager.findProfileById(userId);

    res.render("profile", {
      title: "Mon Profil",
      subtitle: "Infos personnelles",
      clientProfil: clientProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur chargement profil");
  }
};

// --- GESTION DES ACTIONS (POST) ---
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
        subtitle: "Erreur",
        error: "Mot de passe incorrect",
      });

    // 3. Session
    req.session.userId = user.client_id;
    req.session.userRole = user.role;
    req.session.isLoggedIn = true;

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
