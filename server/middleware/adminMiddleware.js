// server/middleware/adminMiddleware.js

// Middleware pour vérifier si l'utilisateur est un administrateur
const checkAdmin = (req, res, next) => {
    // Rendre compatible adminMiddleware avec Angular et le projet full Node.js
    // est-ce que l'URL commence par '/api' OU si le client demande du JSON ?
    const isApi = req.path.startsWith('/api') || req.headers.accept?.includes('application/json')

    // Cas 1 -> Utilisateur non connecté
    if (!req.session || !req.session.userId) {
        if (isApi) {
            // Pour Angular : Erreur 401 (Non autorisé)
            return res.status(401).json({ message : "Non connecté. Session expirée ou inexistante."});
        } else {
            // Pour EJS : Redirection vers le Login
            return res.redirect("/login");
        }
    };

    // Cas -> Utilisateur connecté mais pas Admin
    if (req.session.role === 'administrateur' || req.session.role === 'admin') {
        next();
    } else {
        console.log(`Tentative d'intrusion admin par user ${req.session.userId}`);
        if (isApi) {
            // Pour Angular : Erreur 403 (Interdit)
            return res.status(403).json({ message: "Accès refusé : Droits administrateur requis." });
        } else {
            // Pour EJS : Redirection vers le profil
            return res.redirect('/profile');
        }

    };
}; 

module.exports = checkAdmin;