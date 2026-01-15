// client/src/app/pages/booking-success/booking-success.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-success.component.html',
  styleUrl: './booking-success.component.scss'
})
export class BookingSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  isLoading = true;
  success = false;
  errorMessage = '';

  ngOnInit() {
    // 1. On récupère le session_id dans l'URL (?session_id=...)
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (sessionId) {
      // 2. On appelle le backend pour valider et enregistrer
      this.bookingService.validatePayment(sessionId).subscribe({
        next: () => {
          this.success = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = "Erreur lors de la validation du paiement.";
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = "Aucun identifiant de session trouvé.";
      this.isLoading = false;
    }
  }
}