// js/main.js
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------
     MENU BURGER
     ------------------------------------------- */
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
  }

  /* -------------------------------------------
     CARROUSEL
     ------------------------------------------- */
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (slides.length > 0) {
    let currentIndex = 0;
    let autoPlayInterval;
    const timePerSlide = 5000; // 5 secondes par image

    // Fonction principale pour changer de slide
    const goToSlide = (index) => {
      // Enlever la classe active de la slide courante
      slides[currentIndex].classList.remove('active');
      
      // Mettre à jour l'index
      currentIndex = index;
      
      // 3. Gérer les dépassements (boucle infinie)
      if (currentIndex < 0) {
        currentIndex = slides.length - 1;
      } else if (currentIndex >= slides.length) {
        currentIndex = 0;
      }
      
      // 4. Ajouter la classe active à la nouvelle slide
      slides[currentIndex].classList.add('active');
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    // Gestion du clic sur les boutons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay(); // Redémarre le chrono si l'utilisateur clique
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Fonction pour démarrer le défilement automatique
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, timePerSlide);
    };

    // Fonction pour réinitialiser le chrono (quand on interagit manuellement)
    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    // Lancement de l'auto-play au chargement
    startAutoPlay();
  }


    /* -------------------------------------------
     Dates du formulaire de recherche
     ------------------------------------------- */
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

