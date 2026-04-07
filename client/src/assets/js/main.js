// src/assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------ */
  /* ---   MENU BURGER    --- */
  /* ------------------------ */
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
  }

});

