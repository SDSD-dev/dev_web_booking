Markdown

# 🏨 Plateforme de Réservation Hôtelière Full-Stack

![Angular](https://img.shields.io/badge/Angular-20+-dd0031?logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Relationnel-4479A1?logo=mysql&logoColor=white)

Une application web complète et performante de réservation d'hôtels en ligne, basée sur une architecture découplée. Ce projet met en valeur une approche robuste "Back-end First" combinée à une interface utilisateur moderne, fluide et hautement accessible.

### 🌐 Démonstrations de l'Intégration (Versions Statiques)
Pour évaluer l'intégration UI/UX sans dépendance serveur, deux déclinaisons front-end ont été développées :
* 🎨 **[Version Tailwind CSS (Dark Mode)](https://sdsd-dev.github.io/dev_web_booking/booking-bloc1-static-tailwind/index.html)** : Interface moderne démontrant la maîtrise des frameworks utilitaires.
* 🏛️ **[Version CSS Natif (Classic)](https://sdsd-dev.github.io/dev_web_booking/booking-bloc1-static/index.html)** : Interface "from scratch" validant la maîtrise absolue du CSS pur (Grid/Flexbox) et de l'accessibilité.

---

## 🛠️ Stack Technique

* **Front-End (SPA) :** Angular 20+, TypeScript, RxJS, Reactive Forms.
* **Intégration & Design :** Tailwind CSS, CSS3 Natif, HTML5 Sémantique.
* **Back-End (API) :** Node.js, Express.
* **Base de Données :** MySQL (Requêtes natives via `mysql2`).
* **Sécurité & Paiement :** Bcrypt, Stripe API (Checkout Sessions).
* **Outils & Qualité :** Faker.js, WAVE (Accessibilité).

---

## 🚀 Points Forts & Fonctionnalités Clés

### ⚡ Performances & Optimisation Full-Stack
* **Pagination Dynamique :** Synchronisation complète entre les requêtes SQL (`LIMIT/OFFSET`) et l'affichage Angular pour minimiser l'impact sur les ressources du serveur de base de données.

### 🛡️ Sécurité & Architecture ROLES (RBAC)
* Authentification sécurisée avec hachage cryptographique (`Bcrypt`).
* Contrôle d'accès strict (Visiteur, Client, Admin) via des **Guards Angular** et des **Middlewares Node.js**.
* Gestion complète du profil utilisateur avec fonctionnalité de modification de mot de passe.

### 💳 Flux E-Commerce Sécurisé
* Tunnel de réservation avec figeage des tarifs en base de données pour garantir une intégrité comptable totale (protection contre la fluctuation des prix).
* Intégration complète et sécurisée de l'API **Stripe** pour la délégation du paiement.

### ♿ Accessibilité (A11y) & Inclusion
* Conformité aux normes WCAG (contrastes renforcés, navigation clavier, attributs ARIA).
* **Module OpenDyslexic (JS Vanilla) :** Activation à la volée d'une typographie adaptée avec persistance des préférences utilisateur via `localStorage`.

---

## 📂 Organisation de l'Architecture

Le projet respecte une séparation stricte des responsabilités (*Separation of Concerns*) :

* **`/client/` (Front-End Angular) :** Architecture basée sur des composants autonomes (*Standalone Components*). Séparation logique entre *Smart Components* (logique métier/données) et *Dumb Components* (présentation).
* **`/server/` (Back-End MVC) :** Moteur API REST en Node.js conçu sans ORM. Utilisation de requêtes préparées et gestion rigoureuse des contraintes relationnelles (ex: `ON DELETE CASCADE` pour la conformité RGPD).
* **Dossiers Statiques :** Maquettes interactives HTML/CSS validant la manipulation du DOM de manière autonome.
* **`/documents/` :** Regroupe les livrables d'ingénierie (schémas UML de la BDD, architecture globale).

---

## 🔧 Installation & Lancement Local

### 1. Prérequis
* Node.js (v22+)
* MySQL Server (v8+)
* Angular CLI (`npm install -g @angular/cli`)

### 2. Déploiement de l'API (Back-End)
```bash
cd server
npm install
# Créez votre fichier .env à partir du fichier .env.example
node seed.js # Génère le jeu de données de test en BDD
npm run dev  # Lance le serveur sur le port 3000
```

---

## 📌 Historique du Design

La version initiale de ce projet a été entièrement développée en HTML5/CSS3 natif (sans framework) afin de valider des contraintes strictes d'intégration pure, avant de migrer vers l'écosystème Tailwind CSS actuel. L'historique complet de cette transition reste documenté à des fins d'ingénierie.