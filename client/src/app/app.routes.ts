// client/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth-guard';
import { HotelDetailComponent } from './pages/hotel-detail/hotel-detail.component';
import { BookingComponent } from './pages/booking/booking.component';
import { BookingSuccessComponent } from './pages/booking-success/booking-success.component';
 
export const routes: Routes = [
  // Route par défaut (la racine '')
  { path: '', component: HotelListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, //  authGuard -> il faut resté connecté pour affiché le profil
  { path: 'hotel/:id', component: HotelDetailComponent },
  { path: 'booking/success', component: BookingSuccessComponent },
  { path: 'booking/:id', component: BookingComponent, canActivate: [authGuard] }, //  authGuard -> il faut resté connecté pour réserver
  // Route wildcard (si l'URL n'existe pas -> redirection accueil) -> toujours le mettre à la fin
  { path: '**', redirectTo: '' },
];
