// src/app/components/home-search/home-search.component.ts
import { Component, EventEmitter, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss',
})
export class HomeSearchComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);

  // Envoie les résultats au parent (HotelHomeComponent)
  @Output() searchCriteria = new EventEmitter<any>();

  // --- VARIABLES POUR LES DATES ---
  today: string = '';
  minDepartureDate: string = '';

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
  
  // --- Carrousel d'images ---
  images = [
    'img_hotels/2025-11-21-1027_0_Original_01_resultat.jpg',
    'img_hotels/2025-11-21-1019_0_Original_resultat.jpg',
    'img_hotels/2025-11-21-1019_0_Original_01_resultat.jpg'
  ];
  currentIndex = 0;
  autoPlayInterval: any; // Stocke l'identifiant du chrono


  ngOnInit() {
    // Initialisation des dates (Aujourd'hui)
    this.today = new Date().toISOString().split('T')[0];
    this.minDepartureDate = this.today; // Par défaut, le départ minimum est aujourd'hui

    // Écoute réactive du champ "Arrivée" (dateDebut)
    this.searchForm.get('dateDebut')?.valueChanges.subscribe(nouvelleDateArrivee => {
      if (nouvelleDateArrivee) {
        // Maj de la date minimum de départ
        this.minDepartureDate = nouvelleDateArrivee;
        
        // Si l'utilisateur a déjà choisi une date de départ antérieure -> à sa nouvelle date d'arrivée, on réinitialise la date de départ
        const dateFinActuelle = this.searchForm.get('dateFin')?.value;
        if (dateFinActuelle && dateFinActuelle < nouvelleDateArrivee) {
          this.searchForm.get('dateFin')?.setValue(nouvelleDateArrivee);
        }
      } else {
        this.minDepartureDate = this.today;
      }
    });

  // Démarre le défilement automatique du carrousel
    this.startAutoPlay();
  }

  // Nettoyer le chrono quand on quitte la page
  ngOnDestroy() {
    this.stopAutoPlay();
  }

// --- LOGIQUE DU CARROUSEL ---

  startAutoPlay() {
    // Change d'image toutes les 5 secondes
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  next() {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : this.currentIndex + 1;
    this.resetAutoPlay();
  }

  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.images.length - 1 : this.currentIndex - 1;
    this.resetAutoPlay();
  }
}
