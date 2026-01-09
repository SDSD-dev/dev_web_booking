# dev_web_booking

Projet Formation - online booking applications

# Plateforme de Réservation Hôtelière - Projet Full Stack

Ce projet est réalisé dans le cadre de mon projet de fin d'études pour le titre de **Développeur Web Full Stack**.
L'objectif est de concevoir et développer une application web complète de réservation en ligne (type Booking.com), en respectant des contraintes techniques précises pour valider les compétences Front-End, Back-End et Architecture.

## 🎯 Objectifs Pédagogiques

* **Bloc 1 (Front-End) :** Intégration responsive, accessibilité (ARIA), HTML5/CSS3.
* **Bloc 2 (Back-End) :** Développement **"From Scratch"** (sans framework back-end type Symfony/NestJS) pour maîtriser la logique MVC, la POO et le SQL brut.
* **Bloc 3 (Framework - À venir) :** Évolution vers une architecture API Rest avec un Front-End moderne (Angular).

## 🛠️ Stack Technique Actuelle (Bloc 1 & 2)

* **Serveur :** Node.js / Express
* **Base de Données :** MySQL (avec `mysql2` connector)
* **Templating :** EJS (Embedded JavaScript)
* **Front-End :** HTML5, CSS3 (Vanilla + Custom), JavaScript
* **Outils :**
  * `Faker.js` : Génération de données de test (Seeding).
  * `Bcrypt` : Hachage sécurisé des mots de passe.
  * `Dotenv` : Gestion des variables d'environnement.

## 🏗️ Architecture

Le projet suit strictement le modèle **MVC (Modèle - Vue - Contrôleur)** pour assurer la maintenabilité et la séparation des responsabilités :

* **Models :** Classes POO gérant les interactions SQL (ex: `HotelManager`, `UserManager`).
* **Controllers :** Logique métier orchestrant les requêtes et les réponses.
* **Views :** Fichiers EJS découpés en "partials" (header, footer) pour l'interface utilisateur.

## 🎨 Conception & UI/UX

L'approche de développement privilégie la fonctionnalité (Back-End First). Cependant, l'expérience utilisateur (UX) et l'interface (UI) ont été conçues en amont.

* **Outil de maquettage :** Figma.
* **État du Design :** Maquettes Haute-Fidélité (Hi-Fi) réalisées.
* **Approche :** Mobile-First, respectant les heuristiques d'utilisabilité.

> **Note :** La capture d'écran ci-dessous montre la maquette cible.
http://www.darkserge.com/wp-content/uploads/2025/12/SDSD-dev-Screeshot-FIGMA-02.jpg

## 🚀 État d'Avancement

### ✅ Back-End & Architecture (Terminé - Bloc 2)

* **Architecture Hybride :** Le serveur Node.js agit comme un serveur MVC classique (pour EJS) ET comme une API REST (pour Angular) simultanément.
* **Base de Données :** Modèle relationnel complet (MySQL) avec script de `seed` pour données de test.
* **Logique Métier :**
    * Algorithme de vérification de disponibilité (gestion des conflits de dates).
    * Jointures SQL optimisées pour la récupération des images (Cover).
* **Administration (Back-Office) :** Interface CRUD complète pour gérer les hôtels et services (réservée aux Admins).
* **Paiement :** Intégration fonctionnelle de **Stripe** (Checkout session & Webhook simulé).

### ✅ Front-End "Server-Side" (EJS - Terminé)

* **Tunnel de Réservation :** Flux complet fonctionnel (Recherche -> Détail -> Panier -> Paiement -> Confirmation).
* **Espace Client :** Historique des commandes et possibilité d'annuler une réservation.
* **Communication :** Formulaire de contact connecté à la BDD.

### 🚧 Front-End "SPA" (Angular - En cours - Bloc 3)

* **Architecture :**
    * Mise en place d'Angular v20+ avec **Standalone Components**.
    * Configuration du **Proxy** pour éviter les problèmes CORS avec l'API Node.js.
    * Structure stricte : Services, Smart Components (Pages) & Dumb Components (UI).
* **Fonctionnalités implémentées :**
    * Connexion API REST (`HttpClient`).
    * Affichage dynamique de la liste des hôtels (Composant `HotelList`).
    * Cartes Hôtels réutilisables (`HotelCard`) avec gestion des images distantes.
* **Design :** Intégration HTML/CSS responsive de la page d'accueil.

### 📅 À venir (Roadmap)

* **Finalisation Angular :**
    * Portage du Tunnel de réservation (Datepicker & Formulaires Réactifs).
    * Gestion de l'authentification côté Angular (Session/Cookie).
* **Polissage UI/UX (Bloc 1) :** Harmonisation du Design System (CSS) entre la version EJS et Angular selon la maquette Figma.
* **DevOps :** Tests unitaires (Jest/Jasmine) et déploiement CI/CD.

## ⚙️ Installation

1. Cloner le dépôt. 
2. `npm install` pour installer les dépendances. 
3. Configurer le fichier `.env` (DB_HOST, DB_USER, etc.). 
4. Lancer `node server/seed.js` pour initialiser la BDD. 
5. Lancer `node server/server.js` pour démarrer l'application.
