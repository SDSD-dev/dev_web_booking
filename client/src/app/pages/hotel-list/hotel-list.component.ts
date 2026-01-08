import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HotelService, Hotel } from '../../services/hotel.service';
import { Observable } from 'rxjs';
import { HotelCardComponent } from '../../components/hotel-card/hotel-card.component';

// Composant pour afficher la liste des hôtels
@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [AsyncPipe, HotelCardComponent], // On importe le pipe pour l'utiliser dans le HTML
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent {
  // Injectios du service
  private hotelService = inject(HotelService);

  // Récupération des données
  hotels$: Observable<Hotel[]> = this.hotelService.getHotels();
}
