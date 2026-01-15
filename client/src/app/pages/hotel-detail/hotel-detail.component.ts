// src/app/pages/hotel-detail/hotel-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Pour lire l'URL
import { CommonModule } from '@angular/common'; // Pour le pipe async, json, currency
import { RouterLink } from "@angular/router";
import { HotelService, HotelDetailResponse } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss',
})
export class HotelDetailComponent {
  private route = inject(ActivatedRoute);
  private hotelService = inject(HotelService);

  // Stockage des réponses
  hotelData: HotelDetailResponse | null = null;
  loading = true;

  ngOnInit() {
    // Récupération de l'ID dans l'URL avec 'snapshot'
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      // Appel API
      this.hotelService.getHotelById(id).subscribe({
        next: (data) => {
          this.hotelData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

}
