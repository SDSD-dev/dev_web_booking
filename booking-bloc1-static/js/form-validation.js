// ----------------------------------------------
// Formulaire de inscription + Login + Contact
// ----------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  // Cible tous les formulaires qui ont l'attribut 'novalidate'
  const forms = document.querySelectorAll('form[novalidate]');
  
  // Expressions régulières universelles
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Suivi des champs "touchés" (qui ont perdu le focus)
    const touchedFields = new Set();

    // INITIALISATION (Création sécurisée des messages d'erreur)
    inputs.forEach(input => {
      // Identifiant unique pour relier l'input à son message d'erreur (A11y)
      const errorId = `${input.id || input.name}-error`;
      
      // Vérifie si le message n'existe pas déjà !
      let errorMsg = document.getElementById(errorId);
      
      if (!errorMsg) {
        errorMsg = document.createElement('small');
        errorMsg.id = errorId;
        errorMsg.className = 'error-feedback';
        errorMsg.setAttribute('aria-live', 'polite'); // Accessibilité
        
        // Placement spécifique pour les cases à cocher (après le label)
        if (input.type === 'checkbox') {
          input.closest('label').insertAdjacentElement('afterend', errorMsg);
        } else {
          input.insertAdjacentElement('afterend', errorMsg);
        }
      }

      // Liaison pour les lecteurs d'écran
      input.setAttribute('aria-describedby', errorId);

      // Événement BLUR (L'utilisateur quitte le champ = Touched)
      input.addEventListener('blur', () => {
        touchedFields.add(input.id || input.name);
        validateForm();
      });

      // Événements INPUT/CHANGE (Frappe clavier ou case cochée)
      input.addEventListener('input', validateForm);
      if (input.type === 'checkbox') {
        input.addEventListener('change', validateForm);
      }
    });

    // FONCTION DE VALIDATION GLOBALE
    function validateForm() {
      let isFormValid = true;

      inputs.forEach(input => {
        let isFieldValid = true;
        let message = '';
        const value = input.value.trim();
        const errorContainer = document.getElementById(`${input.id || input.name}-error`);

        // Règle A : Champ obligatoire (Required)
        if (input.hasAttribute('required')) {
          if (input.type === 'checkbox' && !input.checked) {
            isFieldValid = false;
            // Message RGPD ou n'importe quelle checkbox
            message = 'Vous devez cocher cette case pour continuer.'; 
          } else if (value === '') {
            isFieldValid = false;
            message = 'Ce champ est obligatoire.';
          }
        }

        // Règle B : Format Email (Seulement si rempli)
        if (isFieldValid && input.type === 'email' && value !== '') {
          if (!emailRegex.test(value)) {
            isFieldValid = false;
            message = 'L\'adresse e-mail n\'est pas valide.';
          }
        }

        // Règle C : Format Téléphone (Seulement si rempli = Optionnel autorisé)
        if (isFieldValid && input.type === 'tel' && value !== '') {
          if (!phoneRegex.test(value)) {
            isFieldValid = false;
            message = 'Format invalide (ex: 06 12 34 56 78).';
          }
        }

        // MISE À JOUR DE L'INTERFACE (Uniquement si "touched")
        if (touchedFields.has(input.id || input.name)) {
          if (!isFieldValid) {
            input.classList.add('input-error');
            input.classList.remove('input-success');
            input.setAttribute('aria-invalid', 'true');
            errorContainer.textContent = message;
          } else {
            input.classList.remove('input-error');
            input.setAttribute('aria-invalid', 'false');
            errorContainer.textContent = '';
            
            // Met la bordure verte si c'est rempli/coché
            if (value !== '' || (input.type === 'checkbox' && input.checked)) {
              input.classList.add('input-success');
            }
          }
        }

        // Si un champ invalide, tout le formulaire l'est
        if (!isFieldValid) {
          isFormValid = false;
        }
      });

      // GESTION DU BOUTON SUBMIT
      if (submitBtn) {
        submitBtn.disabled = !isFormValid;
        submitBtn.classList.toggle('btn-disabled', !isFormValid);
      }
    }

    // Lancement de la vérification au chargement de la page (Griser le bouton)
    validateForm();
  });

});