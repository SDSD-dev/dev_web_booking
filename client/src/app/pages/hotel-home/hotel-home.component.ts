// src/app/pages/hotel-home/hotel-home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { RouterLink } from '@angular/router';
import { Hotel } from '../../interfaces/hotel.model';
import { HotelCardComponent } from '../../components/hotel-card/hotel-card.component';
import { HomeSearchComponent } from '../../components/home-search/home-search.component';
// import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-hotel-home',
  standalone: true,
  imports: [RouterLink, HotelCardComponent, HomeSearchComponent], // On importe le pipe pour l'utiliser dans le HTML
  templateUrl: './hotel-home.component.html',
  styleUrl: './hotel-home.component.scss',
})

export class HotelHomeComponent {
  // Injection du service
  private hotelService = inject(HotelService);
  // authService = inject(AuthService);

  hotels: Hotel[] = [];
  loading = false;
  hasSearched = false;

  // Variables de pagination
  currentPage: number = 1;
  totalPages: number = 1;
  // pagination search
  allSearchResults: Hotel[] = [];
  
  // Méthode pour gérer les critères de recherche envoyés par le composant enfant
  handleSearch(criteria: any) {
    this.hasSearched = true; // indique qu'une recherche est en cours
    this.loading = true; // affiche un loader pendant la recherche
    this.hotelService.searchHotels(criteria).subscribe({
      next: (results) => {
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
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Si page 1: index 0 à 4. Si page 2: index 4 à 8...
      const startIndex = (page - 1) * 4;
      const endIndex = startIndex + 4;
      // on affiche que 4 hôtels du grand tableau d'hôtels
      this.hotels = this.allSearchResults.slice(startIndex, endIndex);
      setTimeout(() => {
          window.scrollTo({ top: 800, behavior: 'smooth' });
        }, 50);
    }
  }

  // Méthode appelée quand le formulaire de recherche renvoie des résultats
  updateList(results: Hotel[]) {
    this.hotels = results;
  }
}


