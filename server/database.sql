DROP DATABASE IF EXISTS data_projet3_hotel_01;
CREATE DATABASE data_projet3_hotel_01;
USE data_projet3_hotel_01;

-- 1. CLIENTS
CREATE TABLE clients (
  id_client INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  telephone VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  pays VARCHAR(100),
  ville VARCHAR(100),
  code_postal VARCHAR(20),
  rue VARCHAR(200)
);

-- 2. CONNEXIONS
CREATE TABLE connexions (
  id_connexion INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'client', -- 'admin', 'prestataire', 'client'
  client_id INT UNIQUE,
  FOREIGN KEY (client_id) REFERENCES clients(id_client) ON DELETE CASCADE
);

-- 3. HOTEL
CREATE TABLE hotel (
  id_hotel INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  address VARCHAR(100), 
  city VARCHAR(100), 
  country VARCHAR(100),
  currency VARCHAR(20),
  user_id INT,
  description_hotel TEXT,
  piscine BOOLEAN DEFAULT FALSE,
  spa BOOLEAN DEFAULT FALSE,
  animaux BOOLEAN DEFAULT FALSE,
  wifi BOOLEAN DEFAULT FALSE,
  front_de_mer BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES connexions(id_connexion) ON DELETE SET NULL
);

-- 4. HOTEL IMAGES
CREATE TABLE hotel_images (
  id_image INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  url_image VARCHAR(255),
  tag VARCHAR(100),
  FOREIGN KEY (hotel_id) REFERENCES hotel(id_hotel) ON DELETE CASCADE
);

-- 5. CHAMBRES
CREATE TABLE chambres (
  id_chambre INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  type_chambre VARCHAR(100),
  capacite_max INT,
  nombre_total_unites INT,
  prix_base DECIMAL(10,2),
  prix_enfant_sup DECIMAL(10,2),
  description_chambre TEXT,
  reduction_pourcentage DECIMAL(5,2),
  date_fin_promo DATE,
  FOREIGN KEY (hotel_id) REFERENCES hotel(id_hotel) ON DELETE CASCADE
);

-- 6. CHAMBRE IMAGES
CREATE TABLE chambre_images (
  id_image INT PRIMARY KEY AUTO_INCREMENT,
  chambre_id INT NOT NULL,
  url_image VARCHAR(255) NOT NULL,
  tag VARCHAR(100),
  FOREIGN KEY (chambre_id) REFERENCES chambres(id_chambre) ON DELETE CASCADE
);

-- 7. COMMANDES
CREATE TABLE commandes (
  id_commande INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  hotel_id INT, 
  date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_sejour_debut DATE NOT NULL,
  date_sejour_fin DATE NOT NULL, 
  nbr_adulte INT,
  nbr_enfant INT,
  montant_total DECIMAL(10,2),
  statut_commande VARCHAR(50) DEFAULT 'confirmee', 
  FOREIGN KEY (client_id) REFERENCES clients(id_client) ON DELETE CASCADE,
  FOREIGN KEY (hotel_id) REFERENCES hotel(id_hotel) ON DELETE CASCADE
);

-- 8. LIGNES_COMMANDE
CREATE TABLE lignes_commande (
  id_ligne INT PRIMARY KEY AUTO_INCREMENT,
  commande_id INT NOT NULL,
  chambre_id INT NOT NULL,
  quantite INT DEFAULT 1,
  prix_unitaire_facture DECIMAL(10,2), 
  nbr_nuits INT,
  prix_total_ligne DECIMAL(10,2),
  FOREIGN KEY (commande_id) REFERENCES commandes(id_commande) ON DELETE CASCADE,
  FOREIGN KEY (chambre_id) REFERENCES chambres(id_chambre) ON DELETE CASCADE
);

-- 9. AVIS
CREATE TABLE avis (
  id_avis INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT,
  client_id INT,
  note INT CHECK (note >= 0 AND note <= 5),
  avis TEXT,
  date_avis DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotel(id_hotel) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id_client) ON DELETE SET NULL
);

-- 10. CONTACT
CREATE TABLE contact (
  id_contact INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  telephone VARCHAR(100),
  message TEXT NOT NULL,
  rgpd BOOLEAN NOT NULL DEFAULT 0,
  date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(50) DEFAULT 'nouveau'
);