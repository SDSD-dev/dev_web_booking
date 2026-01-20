// src/app/pages/booking/booking.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Room, HotelService } from '../../services/hotel.service';
import { RoomService } from '../../services/room/room.service';
import { BookingService } from '../../services/booking/booking.service';



@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private hotelService = inject(HotelService);

  room: Room | null = null;
  bookingForm: FormGroup = this.fb.group({
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    adults: [1, [Validators.required, Validators.min(1)]],
    children: [0, [Validators.required, Validators.min(0)]]
  });
  totalPrice: number = 0;
  numberOfNights: number = 0;
  isCapacityExceeded: boolean = false;

  ngOnInit() {
    // Récupération de la recherche
    const savedCriteria = this.hotelService.lastSearchCriteria;
    
    // Pour remplir le formulaire avec les valeurs mémorisés
    if (savedCriteria) {
      this.bookingForm.patchValue({
        dateDebut: savedCriteria.dateDebut,
        dateFin: savedCriteria.dateFin,
        adults: savedCriteria.adults || 1,
        children: savedCriteria.children || 0, 
      });
    }

    // Chargement de la chambre
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.roomService.getRoomById(id).subscribe({
        next: (data) => {
          this.room = data;

          // Pour forcer le calcule du total tout de suite avec les dates
          this.calculeTotal();
        },
        error: (err) => console.error("Erreur chargement chambre", err)
      });
    }

  };

  calculeTotal() {
    if (!this.room) return;

    // Vérification de la Capacité
    const nbAdults = this.bookingForm.value.adults;
    const nbChildren = this.bookingForm.value.children;
    const totalPeople = nbAdults + nbChildren

    if (totalPeople > this.room.capacite_max) {
      this.isCapacityExceeded = true;
    } else {
      this.isCapacityExceeded = false;
    };

    // Calcul du prix en fonction des dates
    if (this.bookingForm.valid && this.room) {
      const start = new Date(this.bookingForm.value.dateDebut);
      const end = new Date(this.bookingForm.value.dateFin);
      // Calcul du nombre de nuits (conversion millisecondes -> jours)
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        this.numberOfNights = diffDays;
        this.totalPrice = diffDays * this.room.prix_base;
      } else {
        this.numberOfNights = 0;
        this.totalPrice = 0;
      };
    } else {
      this.numberOfNights = 0;
      this.totalPrice = 0;
    }
  }

  onBook() {
    if (this.bookingForm.valid && !this.isCapacityExceeded) {
      // console.log("Prêt à envoyer vers Stripe :", {
      //   room: this.room?.id_chambre,
      //   dates: this.bookingForm.value,
      //   total: this.totalPrice
      // });

      const bookingData = {
        roomId: this.room?.id_chambre,
        dates: {
          dateDebut: this.bookingForm.value.dateDebut,
          dateFin: this.bookingForm.value.dateFin
        },
        travelers: {
          adults: this.bookingForm.value.adults,
          children: this.bookingForm.value.children
        },
        total: this.totalPrice
      };

      console.log("Envoi au serveur :", bookingData); // vérification

      // Appel serveur
      this.bookingService.createCheckoutSession(bookingData).subscribe({
        next: (Response) => {
          // Redirection vers Stripe
          window.location.href = Response.url;
        },
        error: (err) => {
          console.error("Erreur paiement", err);
          alert("Une erreur est survenue lors de l'initialisation du paiement.");
        }
      });
    }
  }
}
