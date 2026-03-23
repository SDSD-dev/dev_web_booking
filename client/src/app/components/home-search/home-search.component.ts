// src/app/components/home-search/home-search.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss',
})
export class HomeSearchComponent {
  private fb = inject(FormBuilder);
  // private hotelService = inject(HotelService);

  // Envoie les résultats au parent (HotelListComponent)
  // @Output() searchResults = new EventEmitter<any[]>();
  @Output() searchCriteria = new EventEmitter<any>();

  // Définition du formulaire de recherche
  searchForm: FormGroup = this.fb.group({
    city: [''],
    dateDebut: [''],
    dateFin: [''],
    adults: [1],
    children: [0],
    piscine: [false],
    spa: [false],
    animaux: [false],
    wifi: [false],
    parking: [false],
  });

  // Soumission du formulaire
  onSearch() {
    const criteria = this.searchForm.value;

    this.searchCriteria.emit(criteria);

  }
  
  // Carrousel d'images
  images = [
    'img_hotels/2025-11-21-1027_0_Original_01_resultat.jpg',
    'img_hotels/2025-11-21-1019_0_Original_resultat.jpg',
    'img_hotels/2025-11-21-1019_0_Original_01_resultat.jpg'
  ];
  
  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : this.currentIndex + 1;
  }

  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.images.length - 1 : this.currentIndex - 1;
  }
  
}
