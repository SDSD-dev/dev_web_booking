// server/middleware/adminMiddleware.js

// Middleware pour vérifier si l'utilisateur est un administrateur
const checkAdmin = (req, res, next) => {
    // 1. Vérification si l'utilisateur est connecté (Sécurité de base)
    if (!req.session || !req.session.userId) {
        return res.redirect("/login");
    }
    // 2. Vérification du role (Sécurité Admin)
    if (req.session.role === 'administrateur') {
        // autorisation Admin
        next();
    } else {
        // C'est un client normal qui essaie d'entrer dans la zone admin
        // On le renvoie gentiment (ou brutalement avec une 403)
        console.log(`Tentative d'intrusion admin par l'utilisateur ${req.session.userId}`);
        res.redirect('/profile');
        // res.status(403).render('error', {
        //     title: "Accès Refusé",
        //     subtitle: "Vous n'avez pas les droits d'administrateur."
        // });
    }
}; 

module.exports = checkAdmin;