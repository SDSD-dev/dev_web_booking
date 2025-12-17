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

### ✅ Fonctionnalités Implémentées

* **Architecture & Données :**
  * Refonte de l'architecture en **MVC** (Modèle-Vue-Contrôleur) pour séparer la logique métier de l'affichage.
  * Script SQL de création de tables relationnelles (Clients, Hôtels, Chambres, Réservations, Contact...).
  * Script `seed.js` pour la génération de données fictives (via `faker`).

* **Authentification & Utilisateurs :**
  * Inscription et Connexion sécurisée (hashage des mots de passe).
  * Gestion de session utilisateur (cookie/session server-side).
  * Accès au profil personnel protégé par middleware.

* **Catalogue & Navigation :**
  * **Moteur de recherche :** Filtrage des hôtels par ville et critères.
  * **Liste des résultats :** Affichage dynamique des hôtels trouvés depuis la base de données.
  * **Fiche Détail Hôtel :** Consultation approfondie d'un hôtel avec liste des chambres et équipements associés (données dynamiques).
  * **Vues Modulaires :** Utilisation de "Partials" EJS (Header/Footer) pour une maintenance simplifiée.

* **Communication :**
  * Formulaire de contact fonctionnel avec enregistrement des messages en base de données (Back-end).

### 🚧 En cours de développement

* **Tunnel de Réservation :** Sélection des dates, vérification algorithmique des disponibilités (gestion des conflits de dates).
* **Validation de Commande :** Création de la réservation en base de données et simulation de paiement / intégration API (ex: Stripe).

### 📅 À venir (Roadmap)

* **Gestion Client :** Interface pour visualiser, modifier ou annuler ses propres réservations.
* **Back-Office (Admin) :** Interface CRUD complète pour gérer les hôtels, les chambres et les services (accès restreint Admin/Prestataire).
* **Polissage Front-End (Bloc 1) :** Amélioration UX/UI, intégration CSS avancée (Responsive & Accessibilité ARIA).
* **Évolution Architecture (Bloc 3) :** Transformation du Back-end en API RESTful et développement d'un client riche (SPA) avec Angular.
* **DevOps & Qualité :** Mise en place de tests unitaires/intégration et déploiement continu.

## ⚙️ Installation

1. Cloner le dépôt. 
2. `npm install` pour installer les dépendances. 
3. Configurer le fichier `.env` (DB_HOST, DB_USER, etc.). 
4. Lancer `node server/seed.js` pour initialiser la BDD. 
5. Lancer `node server/server.js` pour démarrer l'application.
