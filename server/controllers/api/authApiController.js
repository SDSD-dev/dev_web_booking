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