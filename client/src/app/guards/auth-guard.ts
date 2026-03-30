// client/src/app/guards/auth-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si le signal contient déjà un utilisateur, on autorise l'accès
  if (authService.currentUserSig()) {
    return true; 
  } 
  
  // Si le signal est vide (Retour de Stripe ou rafraîchissement F5)
  // On met en pause et on vérifie la session sur le serveur Node.js
  return authService.checkAuth().pipe(
    map((response: any) => {
      if (response.isAuthenticated) {
        // Le checkAuth a déjà mis à jour le signal via son "tap"
        return true; 
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      // Si le serveur renvoie une erreur (déconnecté, session expirée...)
      router.navigate(['/login']);
      return of(false); // of() permet de renvoyer un Observable résolu avec la valeur false
    })
  );
};