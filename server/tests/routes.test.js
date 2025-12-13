// server/tests/routes.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server"; // On importe l'app exportée à l'étape 3

describe("Vérification des pages publiques", () => {
  // Test 1 : Page d'accueil
  it("GET / doit retourner le code 200 et la page d'accueil", async () => {
    const res = await request(app).get("/");

    // Vérifie le code HTTP
    expect(res.statusCode).toBe(200);
    // Vérifie que le contenu est du HTML (puisque tu utilises EJS)
    expect(res.headers["content-type"]).toMatch(/html/);
    // Optionnel : Vérifie qu'un mot clé de index.ejs est présent
    expect(res.text).toContain('Accueil');
  });

  // Test 2 : Page Contact
  it("GET /contact doit s'afficher correctement", async () => {
    const res = await request(app).get("/contact");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Formulaire de contact"); 
  });

  // Test 3 : Page Login
  it("GET /login doit afficher le formulaire de connexion", async () => {
    const res = await request(app).get("/login"); 
    expect(res.statusCode).toBe(200);
  });

  // Test 4 : Page Register
  it("GET /register doit afficher le formulaire d'inscription", async () => {
    const res = await request(app).get("/register");
    expect(res.statusCode).toBe(200);
  });

  // Test 5 : Page connexion
  it("GET /connexion doit afficher la page de connection", async () => {
    const res = await request(app).get("/connexion");
    expect(res.statusCode).toBe(200);
  });
  


  // Test 6 : Route inconnue
  it("GET /route-inconnue doit retourner 404", async () => {
    const res = await request(app).get("/ceci-n-existe-pas");
    expect(res.statusCode).toBe(404);
  });

  it("GET /Page Profile : comportement si non connecté", async () => {
    const res = await request(app).get("/profile");

    // Si ton serveur redirige les gens non connectés :
    expect(res.statusCode).toBe(302);
    // Vérifier qu'on est redirigé vers le login
    expect(res.headers.location).toBe("/login");
  });
});
