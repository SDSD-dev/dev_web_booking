document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     MENU BURGER
     ========================================= */
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
  }

  /* =========================================
     CARROUSEL
     ========================================= */
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (track && prevBtn && nextBtn) {
    // Array.from transforme les enfants HTML en vrai tableau JS pour les compter
    const slides = Array.from(track.children); 
    let currentIndex = 0; // On commence à la première image (index 0)

    // Fonction qui décale la bande d'images
    const updateCarousel = () => {
      // Si on est à l'index 1, on décale de -100% (vers la gauche), index 2 = -200%, etc.
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Clic sur "Suivant"
    nextBtn.addEventListener('click', () => {
      // Si on est à la dernière image, on revient à 0, sinon on avance de 1
      currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
      updateCarousel();
    });

    // Clic sur "Précédent"
    prevBtn.addEventListener('click', () => {
      // Si on est à la première image, on va à la dernière, sinon on recule de 1
      currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
      updateCarousel();
    });
  }

    /* =========================================
     Dates du formulaire de recherche
     ========================================= */
    // Script pour gérer les dates dans le formulaire de recherche
    // Empêche de choisir une date passée
    // Définit la date minimale pour les deux champs de date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date_debut").setAttribute("min", today);
    document.getElementById("date_fin").setAttribute("min", today);
    const dateDebutInput = document.getElementById("date_debut");
    const dateFinInput = document.getElementById("date_fin");

    dateDebutInput.addEventListener("change", function () {
      dateFinInput.setAttribute("min", this.value);
    });


});

