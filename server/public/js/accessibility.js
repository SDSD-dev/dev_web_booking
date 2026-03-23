// public/js/accessibility.js
document.addEventListener('DOMContentLoaded', () => {
    const btnDyslexic = document.getElementById('btn-dyslexic');
    const body = document.body;

    if (!btnDyslexic) return; // Sécurité si le bouton n'est pas sur la page

    // Vérification de la mémoire du navigateur
    const isDyslexicModeActive = localStorage.getItem('dyslexicMode') === 'true';

    // si déjà activé par l'utilisateur
    if (isDyslexicModeActive) {
        body.classList.add('dyslexic-mode');
        btnDyslexic.setAttribute('aria-pressed', 'true');
        }

    // action du clic
    btnDyslexic.addEventListener('click', () => {
        // ajouter ou supprimer la classe dyslexic-mode
        body.classList.toggle('dyslexic-mode');
        // vérification de l'état après le clic
        const isActiveNow = body.classList.contains('dyslexic-mode');
        // mise à jour del'accessibilité (Aria)
        btnDyslexic.setAttribute('aria-pressed', isActiveNow.toString());
        // save dans la mémoire du navigateur
        localStorage.setItem('dyslexicMode', isActiveNow);
    });
});