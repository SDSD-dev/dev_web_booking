// src/app/pages/hotel-list/hotel-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { HotelService, Hotel } from '../../services/hotel.service';
import { RouterLink } from '@angular/router';
import { HotelCardComponent } from '../../components/hotel-card/hotel-card.component';
import { HomeSearchComponent } from '../../components/home-search/home-search.component';
import { AuthService } from '../../services/auth.service';

// Composant pour afficher la liste des hôtels
@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [RouterLink, HotelCardComponent, HomeSearchComponent], // On importe le pipe pour l'utiliser dans le HTML
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent implements OnInit {
  // Injection du service
  private hotelService = inject(HotelService);
  authService = inject(AuthService);

  hotels: Hotel[] = [];
  loading = true;

  // Méthode d'initialisation
  ngOnInit() {
    // Charge tous les hôtels au démarrage
    this.loadAllHotels();
  };
  
  // Méthode pour charger tous les hôtels
  loadAllHotels() {
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  };
  
  // Méthode pour gérer les critères de recherche envoyés par le composant enfant
  handleSearch(criteria: any) {
    this.loading = true; // On affiche un loader pendant la recherche
    this.hotelService.searchHotels(criteria).subscribe({
      next: (results) => {
        this.hotels = results; // Met à jour la liste avec les résultats
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur de recherche", err);
        this.loading = false;
      }
    });
  }
  // Récupération des données
  // hotels$: Observable<Hotel[]> = this.hotelService.getHotels();

  // Méthode appelée quand le formulaire de recherche renvoie des résultats
  updateList(results: Hotel[]) {
    this.hotels = results;
  }
}


