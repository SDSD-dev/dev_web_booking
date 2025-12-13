// server/middleware/authMiddleware.js
// Fonction pour protéger les routes
const checkAuth = (req, res, next) => {
  // Si la session contient un userId, on laisse passer
  if (req.session && req.session.userId) {
    next();
  } else {
    // Retourne vers Login
    res.redirect("/login");
  }
};

module.exports = checkAuth;
