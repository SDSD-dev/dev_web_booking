// client/src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  email: string;
  nom: string;
  role: string; // <--- C'est le plus important pour le Guard
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

  login(credentials: any): Observable<any> {
    // On envoie email + password au serveur
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      // "tap" permet de faire une action secondaire sans modifier la réponse
      tap((response: any) => {
        this.currentUserSig.set(response.user);
      })
    );
  }

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

  register(userData: any): Observable<any> {
    // userData -> data utilisateur
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
