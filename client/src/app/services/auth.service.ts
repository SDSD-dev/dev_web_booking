// client/src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  email: string;
  nom: string;
  role: string; // important pour le Guard !!!
  prenom?: string; // le ? veut dire optionnel
  id?: number;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth'; // Grâce au proxy !

  // Signal pour stocker l'utilisateur connecté
  currentUserSig = signal<User | null>(null); // User | null soit c'est User soit c'est null

  // Méthode de connexion
  login(credentials: any): Observable<any> {
    // On envoie email + password au serveur
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      // "tap" permet de faire une action secondaire sans modifier la réponse
      tap((response: any) => {
        this.currentUserSig.set(response.user);
      })
    );
  }

  // Méthode de déconnexion
  logout() {
    // Appel API pour tuer la session server
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        // vide le signal
        this.currentUserSig.set(null);        
      },
      error: (err) => console.error('Erreur logout', err)
    })    
  }

  // Vérifie si l'utilisateur est déjà connecté (ex: après un refresh)
  checkAuth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/check`).pipe(
      tap((response: any) => {
        if (response.isAuthenticated) {
            // On restaure le signal !
            this.currentUserSig.set(response.user);
        }
      })
    );
  }

  // Méthode d'inscription
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

}
