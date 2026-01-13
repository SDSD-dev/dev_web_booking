// src/app/components/hotel-card/hotel-card.component.ts
import { Component, Input } from '@angular/core';
// Importez l'interface Hotel pour le typage
import { Hotel } from '../../services/hotel.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss' 
})
export class HotelCardComponent {
  // Utilisation de l'interface Hotel pour typer la propriété d'entrée -> hotel.service
  // ! sert à indiquer que cette propriété sera toujours définie
  @Input() hotel!: Hotel; 
}
