// client/src/app/guards/admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1 - Cas facile : L'utilisateur est déjà chargé en mémoire (navigation interne)
  const user = authService.currentUserSig();
  if (user) {
    if (user.role === 'administrateur' || user.role === 'admin') {
      return true;
    } else {
      router.navigate(['/']); // Redirection vers accueil si connecté mais pas admin
      return false;
    }
  }

  // 2 - Cas difficile : Rafraîchissement (F5) ou Accès direct URL
  // On appelle checkAuth() et on attend la réponse (pipe)
  return authService.checkAuth().pipe(
    map((response: any) => {
      // Le serveur a répondu
      if (response.isAuthenticated && response.user) {
        // On vérifie le rôle reçu du serveur
        if (response.user.role === 'administrateur' || response.user.role === 'admin') {
           // IMPORTANT: On met à jour le signal pour le reste de l'app
           authService.currentUserSig.set(response.user);
           return true; // Accès autorisé !
        }
      }
      
      // Si pas connecté ou pas admin, on redirige vers login
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      // En cas d'erreur serveur (ex: 401, 500)
      router.navigate(['/login']);
      return of(false);
    })
  );
};