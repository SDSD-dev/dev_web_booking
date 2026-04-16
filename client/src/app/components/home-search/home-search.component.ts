// src/app/components/home-search/home-search.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  // Envoie les résultats au parent (HotelHomeComponent)
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
  
  // Obtenir la date du jour au format YYYY-MM-DD (format requis par <input type="date">)
  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Obtenir la date minimum pour le départ
  get minDepartureDate(): string {
    // On lit la valeur actuelle du champ "dateDebut"
    const arrivalDate = this.searchForm.get('dateDebut')?.value;
    // Si une date d'arrivée est choisie, c'est notre minimum. Sinon, c'est aujourd'hui.
    return arrivalDate ? arrivalDate : this.today;
  }
}
