document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Initialisation : Vérifier si le mode est déjà activé dans la mémoire
    const isDyslexicModeActive = localStorage.getItem('dyslexicMode') === 'true';
    if (isDyslexicModeActive) {
        body.classList.add('dyslexic-mode');
    }

    // On écoute les clics sur tout le document
    document.addEventListener('click', (event) => {
        // "closest" permet de vérifier si l'élément cliqué ou l'un de ses parents a l'id "btn-dyslexic"
        const btnDyslexic = event.target.closest('#btn-dyslexic');
        // Si ce n'est pas le bouton dyslexie qui a été cliqué, on ne fait rien
        if (!btnDyslexic) return;
        // Si c'est le bouton : on applique la logique
        body.classList.toggle('dyslexic-mode');
        
        const isActiveNow = body.classList.contains('dyslexic-mode');
        btnDyslexic.setAttribute('aria-pressed', isActiveNow.toString());
        localStorage.setItem('dyslexicMode', isActiveNow);
    });
});