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
  private hotelService = inject(HotelService);

  // Envoie les résultats au parent (HotelListComponent)
  @Output() searchResults = new EventEmitter<any[]>();

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

    this.hotelService.searchHotels(criteria).subscribe({
      next: (hotels) => {
        // resultat pour le parent
        this.searchResults.emit(hotels);
      },
      error: (err) => console.error(err)
    });
  }  
}
