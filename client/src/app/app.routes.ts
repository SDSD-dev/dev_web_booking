// client/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Route par défaut (la racine '')
  { path: '', component: HotelListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  // Route wildcard (si l'URL n'existe pas -> redirection accueil) -> toujours le metter à la fin
  { path: '**', redirectTo: '' },
];
