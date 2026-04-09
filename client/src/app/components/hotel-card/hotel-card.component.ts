// src/app/components/hotel-card/hotel-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importez l'interface Hotel pour le typage
import { Hotel } from '../../interfaces/hotel.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss' 
})
export class HotelCardComponent {
  // Utilisation de l'interface Hotel pour typer la propriété d'entrée -> hotel.service
  // ! sert à indiquer que cette propriété sera toujours définie
  @Input() hotel!: Hotel;

  // Ce "getter" agit comme une variable que le HTML peut lire
  get ratingPercentage(): number {
    // Number() convertit la chaîne en chiffre. Le || 0 sécurise si la valeur est vide.
    const rating = Number(this.hotel.average_rating) || 0;
    return (rating / 5) * 100;
  }
}
