// src/app/pages/hotel-list/hotel-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { RouterLink } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.model';
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

  // Variables de pagination
  currentPage: number = 1;
  totalPages: number = 1;
  // pagination search
  allSearchResults: Hotel[] = [];
  isSearchMode: boolean = false;

  // Méthode d'initialisation
  ngOnInit() {
    // Charge tous les hôtels au démarrage
    this.loadAllHotels(this.currentPage);
  };
  
  // Méthode pour charger tous les hôtels
  loadAllHotels(page: number = 1) {
    this.loading = true;
    this.hotelService.getHotels(page).subscribe({
      next: (data) => {
        this.hotels = data.hotels; 
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.loading = false;
        // Pour remonter en haut de la page (UX)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
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
        this.isSearchMode = true; // mode recherche
        this.allSearchResults = results; // stock les résultats
        // calcul du nbr de page de 4 hôtels -> si 0 on met 1
        this.totalPages = Math.ceil(results.length / 4) || 1 ;
        // affiche le 1er page
        this.goToPage(1);
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur de recherche", err);
        this.loading = false;
      }
    });
  }

  // Méthode pour les boutons de paginations
  goToPage(page: number) {
    // vérification du mode recherche
    if (this.isSearchMode) {
      this.currentPage = page;
      // Si page 1: index 0 à 4. Si page 2: index 4 à 8...
      const startIndex = (page - 1) * 4;
      const endIndex = startIndex + 4;
      // on affiche que 4 hôtels du grand tableau d'hôtels
      this.hotels = this.allSearchResults.slice(startIndex, endIndex);
      setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    } else {
      this.loadAllHotels(page);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  }

  // Méthode appelée quand le formulaire de recherche renvoie des résultats
  updateList(results: Hotel[]) {
    this.hotels = results;
  }
}


