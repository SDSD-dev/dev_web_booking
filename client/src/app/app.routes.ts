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
import { ContactComponent } from './pages/contact/contact.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin-guard';
import { HotelFormComponent } from './pages/admin/hotel-form/hotel-form.component';
 
export const routes: Routes = [
  // Route par défaut (la racine '')
  { path: '', component: HotelListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, //  authGuard -> il faut resté connecté pour affiché le profil
  { path: 'hotel/:id', component: HotelDetailComponent },
  { path: 'booking/success', component: BookingSuccessComponent },
  { path: 'booking/:id', component: BookingComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/hotel/new', component: HotelFormComponent, canActivate: [adminGuard] }, // Route pour la Création (pas d'ID)
  { path: 'admin/hotel/edit/:id', component: HotelFormComponent, canActivate: [adminGuard] }, // Route pour l'Édition (avec ID)
  // Route wildcard (si l'URL n'existe pas -> redirection accueil) -> toujours le mettre à la fin
  { path: '**', redirectTo: '' },
];
