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

## 🚀 État d'Avancement

### ✅ Fonctionnalités Implémentées

* **Système de Base de Données :**
  * Script SQL de création de tables relationnelles (Clients, Hôtels, Chambres, Réservations...).
  * Script `seed.js` permettant de régénérer une BDD fictive complète à la volée.
* **Authentification & Utilisateurs :**
  * Inscription et Connexion sécurisée.
  * Gestion de session utilisateur.
  * Accès au profil personnel.
* **Navigation & Recherche :**
  * Page d'accueil dynamique.
  * Moteur de recherche d'hôtels (par ville/critères).
  * Architecture des vues modulaire (Header/Footer dynamiques).

### 🚧 En cours de développement

* **Fiche Détail Hôtel :** Affichage des équipements et liste des chambres par hôtel.
* **Tunnel de Réservation :** Sélection des dates, vérification des disponibilités (logique complexe), validation de commande.

### 📅 À venir (Roadmap)

* **Back-Office (Admin) :** CRUD complet pour gérer les hôtels et services (Rôle Administrateur/Prestataire).
* **Amélioration du Front-End (Bloc 1)**  :  HTML5, CSS3 (Vanilla + Custom), JavaScript
* **Refonte Framework (Bloc 3) :** Transformation du Back-end en API REST et création d'un client Angular.
