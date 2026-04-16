# dev_web_booking

#  Plateforme de Réservation Hôtelière Full-Stack

![Angular](https://img.shields.io/badge/Angular-20+-dd0031?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Relationnel-4479A1?logo=mysql)

##  Présentation du Projet
Ce projet est développé dans le cadre de ma certification de **Développeur Web Full Stack**. Il s'agit d'une application complète de réservation d'hôtels en ligne. 

L'application repose sur une **architecture découplée** : une API REST codée "from scratch" en Node.js, consommée par une Single Page Application (SPA) Angular. Le développement a été mené avec une approche **"Back-end First"**, garantissant la solidité des données métier avant l'intégration d'une interface utilisateur pensée pour l'accessibilité.

---

##  Objectifs de Certification (Blocs de compétences)

Ce projet valide trois grands domaines d'expertise :

* **Bloc 1 - Intégration Front-End Native :** Création d'une interface UI/UX "from scratch" (sans framework CSS) en **HTML5 / CSS3 pur** (Flexbox/Grid). Focus majeur sur l'**Accessibilité (A11y/WCAG)** et la manipulation du DOM en **JavaScript Vanilla**.
* **Bloc 2 - Back-End & Architecture des Données :** Développement d'une architecture **MVC** sur-mesure en Node.js (sans ORM lourd). Modélisation de base de données relationnelle (MySQL), sécurité et intégration d'API tierce (Stripe).
* **Bloc 3 - Framework Client Riche (SPA) :** Développement du Front-End applicatif avec **Angular 20+** (Standalone Components, RxJS, Reactive Forms) pour une expérience utilisateur fluide et asynchrone.

---

##  Stack Technique & Écosystème

### Moteur / Back-End (API REST)
* **Serveur :** Node.js / Express (utilisé uniquement pour le routage HTTP).
* **Base de Données :** MySQL (Requêtes SQL natives via `mysql2`).
* **Sécurité :** `Bcrypt` (Hachage des mots de passe), Gestion des Sessions côté serveur.
* **Paiement :** API **Stripe** (Checkout Sessions).
* **Outils Dev :** `Faker.js` (Génération du jeu de données Seed), `Dotenv` (Variables d'environnement).

### Interface / Front-End (SPA)
* **Framework :** Angular 20+ (TypeScript).
* **Style :** CSS3 Natif (Mobile-first, Grid, Flexbox).
* **État & Données :** Services Angular, `HttpClient`, Observables (RxJS).
* **Formulaires :** `ReactiveFormsModule` avec validateurs synchrones.

---

##  Fonctionnalités Principales

###  Sécurité & Utilisateurs (RBAC)
* Système d'inscription et de connexion avec hachage cryptographique.
* **Guardians Angular & Middlewares Node :** Protection stricte des routes selon le rôle (Visiteur, Client, Administrateur).
* Gestion du profil utilisateur et de l'historique des commandes.

###  Parcours de Réservation & E-commerce
* Recherche et consultation du catalogue d'hôtels avec **Pagination Fullstack** (SQL `LIMIT/OFFSET` synchronisé avec l'UI Angular).
* Tunnel de réservation fluide avec figeage des prix dans la base de données pour garantir l'intégrité comptable.
* Délégation sécurisée du flux de paiement via **Stripe**.

###  Accessibilité (A11y) & Inclusion
* Respect des balises sémantiques HTML5 et intégration d'attributs `ARIA`.
* Contrats de couleurs validés pour les normes WCAG (contrastes).
* **Feature JS Vanilla :** Module d'assistance permettant l'activation à la volée de la police **OpenDyslexic** avec persistance des préférences (`localStorage`).
* Navigation complète réalisable au clavier.

###  Back-Office Administrateur
* Tableau de bord sécurisé (CRUD) permettant de gérer dynamiquement les hôtels du catalogue.

---

##  Architecture du Code

Le projet est divisé pour assurer une séparation stricte des responsabilités (Separation of Concerns) :

1.  **Back-End (MVC) :**
    * `Managers` : Logique de base de données (Requêtes préparées, Transactions SQL, ON DELETE CASCADE/SET NULL pour le RGPD).
    * `Controllers` : Logique métier.
    * `Routes` : Points d'entrée de l'API.
2.  **Front-End (Angular) :**
    * `Smart Components` : Composants conteneurs gérant la donnée (Pages).
    * `Dumb Components` : Composants de présentation isolés recevant la donnée via `@Input()`.
    * `Models` : Interfaces TypeScript pour le mapping strict des réponses JSON.

---

##  Installation & Déploiement Local

### 1. Prérequis
* Node.js (v22+)
* MySQL Server (v8+)
* Angular CLI (`npm install -g @angular/cli`)

### 2. Configuration du Back-End (API)

* Dans le dossier backend/racine : `npm install`

* Créer un fichier **.env** à la racine (voir .env.example) : DB_HOST, DB_USER, DB_PASS, DB_NAME, STRIPE_SECRET_KEY, etc.

* Générer les données de test (Base de données) : `node seed.js`

* Lancer le serveur de développement (Port 3000 par défaut) : `npm run dev` ou `nodemon server.js`


### 3. Configuration du Front-End (Angular)

* Dans le dossier client/angular : `npm install`

* Lancer le serveur de développement Angular (Port 4200)
* Le **proxy.conf.json**. redirigera automatiquement les appels /api vers le port 3000
ng serve

### Note sur le Design (Version Alternative)
* L'intégration actuelle est réalisée en CSS pur pour répondre aux exigences d'évaluation (Bloc 1).
* Cependant, une version alternative de l'interface explorant l'utilisation du **framework Tailwind CSS** (basée sur une maquette **Figma** "Dark Mode") a été développée pour éprouver la scalabilité de l'API.
* Cette version est consultable sur la branche : **archive/version-tailwind**
