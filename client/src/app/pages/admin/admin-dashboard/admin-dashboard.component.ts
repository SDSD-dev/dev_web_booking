// client/src/app/pages/admin/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotelService, Hotel } from '../../../services/hotel.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private hotelService = inject(HotelService);

  hotels: Hotel[] = [];
  isLoading = true;

  // Chargement des hôtels au démarrage
  ngOnInit() { 
    this.loadHotels();    
  };

  // Fonction pour charger la liste des hôtels
  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.isLoading = false;
      },
      error: (err) => console.error(err)
    })
  };

  // Fonction pour supprimer un hôtel
  deleteHotel(id: number) {
    if(confirm("Êtes-vous sûr de vouloir supprimer cet hôtel ? Cette action est irréversible.")) {
      this.hotelService.deleteHotel(id).subscribe({
        next: () => {
          // Rechargement de la liste après suppression
          this.loadHotels();
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }


}
