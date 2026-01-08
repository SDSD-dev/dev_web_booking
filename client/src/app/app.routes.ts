import { Routes } from '@angular/router';
import { HotelListComponent } from './pages/hotel-list/hotel-list.component';

export const routes: Routes = [
  // Route par défaut (la racine '')
  { path: '', component: HotelListComponent },
  // Route wildcard (si l'URL n'existe pas -> redirection accueil)
  { path: '**', redirectTo: '' },
  // Exemple futur :
  // { path: 'hotel/:id', component: HotelDetailComponent },
];
