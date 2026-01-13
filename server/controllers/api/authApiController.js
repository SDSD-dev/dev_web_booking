// server/controllers/api/authApiController.js
const UserManager = require("../../models/UserManager");
const bcrypt = require("bcrypt");

// API pour la connexion
exports.login = async (req, res) => {
    try {
        console.log("Tentative de connexion API reçue");
        console.log("Headers:", req.headers['content-type']);
        // console.log("Body reçu:", req.body);
        //
        const {email, password } = req.body;

        //
        const user = await UserManager.findByEmail(email);

        if (!user) {
            // Attention : En API, on renvoie des codes d'erreur (401 Unauthorized)
            return res.status(401).json({message: "Email ou mot de passe incorrect."})
        };

        //Vérification du mot de passe
        const match = await bcrypt.compare(password, user.mot_de_passe_hash);

        //
        if (!match) {
            return res.status(401).json({message: "Email ou mot de passe incorrect."})
        };

        // !!!!!!!!!! Création de session
        // cookie automatiquement partagé avec Angular avec le cookie
        req.session.userId = user.client_id;
        req.session.role = user.role;
        req.session.isLoggedIn = true;
        req.session.userInfos = { email: user.email, nom: user.nom };

        // sécurité pour être sûr que la session est sauvée avant de répondre
        req.session.save(err => {
            if (err) return res.status(500).json({message: "Erreur session"});
            // JSON de réponse pour "Connexion réussie"
            res.status(200).json({
                message: "Connexion réussie", 
                user: { 
                    email: user.email, 
                    role: user.role,
                    nom: user.nom
                }
            });
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({message : "Erreur serveur" })
    }
}

exports.logout = async (req, res) => {
    // Détruire la session côté serveur
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({message : "Erreur lors de la déconnexion" })
        }
        // Suppression du cookie côté client
        res.clearCookie('connect.sid') // 'connect.sid' nom par défaut du cookie Express
        // Répondre que c'est ok
        res.status(200).json({ message: "Déconnexion réussie" })
    });
}

exports.checkSession = async (req, res) => {
    if (req.session.userId && req.session.userInfos) {
        return res.status(200).json({ 
            isAuthenticated: true, 
            user: { 
                role: req.session.role,
                email: req.session.userInfos.email,
                nom: req.session.userInfos.nom
            } 
        });
    } else {
        // Pas de session
        return res.status(401).json({ isAuthenticated: false });
    }
};

exports.register = async (req, res) => {
    try {
        // Data du formulaire Angular
        const { nom, prenom, email, password, telephone } = req.body;

        const existingUser = await UserManager.findByEmail(email);
        // Vérifier si l'utilisateur existe déjà
        if (existingUser) {
            return res.status(409).json({ message : "Cet email est déjà utilisé."});
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Créer l'utilisateur via le Manager
        const clientData = {
            nom: nom,
            prenom: prenom,
            email: email, 
            telephone: telephone || null, // Si pas envoyé, on met null
            rue: null,         
            code_postal: null,
            ville: null,
            pays: null
        };
        // Données d'authentification
        const authData = {
            email: email, // L'email pour la table connexions
            hash: hashedPassword
        };  

        // Appel du Manager avec les DEUX arguments
        await UserManager.create(clientData, authData);
        // Réponse de succès
        res.status(201).json({message : "Compte créé avec succès !" });

    } catch (error) {
        console.error("Erreur inscription API:", error)
        res.status(500).json ({message : "Erreur lors de l'inscription."});
    }
}