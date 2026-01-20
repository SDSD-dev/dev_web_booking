// src/app/pages/hotel-list/hotel-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HotelService, Hotel } from '../../services/hotel.service';
import { Observable } from 'rxjs';
import { HotelCardComponent } from '../../components/hotel-card/hotel-card.component';
import { HomeSearchComponent } from '../../components/home-search/home-search.component';

// Composant pour afficher la liste des hôtels
@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [HotelCardComponent, HomeSearchComponent], // On importe le pipe pour l'utiliser dans le HTML
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent implements OnInit {
  // Injectios du service
  private hotelService = inject(HotelService);

  hotels: Hotel[] = [];
  loading = true;

  ngOnInit() {
    // Charge tous les hôtels au démarrage
    this.loadAllHotels();
  };
  
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

  // Récupération des données
  // hotels$: Observable<Hotel[]> = this.hotelService.getHotels();

  // Méthode appelée quand le formulaire de recherche renvoie des résultats
  updateList(results: Hotel[]) {
    this.hotels = results;
  }
}


