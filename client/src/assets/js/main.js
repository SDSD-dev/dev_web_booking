document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------
     EFFET STICKY HEADER
     -------------------------------- */
  // cible -> barre supérieure du header
  const topBar = document.querySelector('.top-bar');

  if (topBar) {
    // On écoute l'événement de défilement (scroll) de la page
    window.addEventListener('scroll', () => {
      
      // Si on descend de plus de 50 pixels
      if (window.scrollY > 50) {
        // On ajoute une classe pour l'ombre
        topBar.classList.add('scrolled-shadow');
      } else {
        // Sinon on la retire (retour tout en haut)
        topBar.classList.remove('scrolled-shadow');
      }
      
    });
  }

});