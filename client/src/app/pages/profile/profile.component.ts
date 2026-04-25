// src/app/pages/profile/profile.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService, BookingHistory } from '../../services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  // Formulaire de profil avec validation
  profileForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: [{value: '', disabled: true}], // On empêche de changer l'email pour l'instant
    telephone: [''],
    rue: [''],
    code_postal: [''],
    ville: [''],
    pays: ['']
  });

  // Formulaire de changement de mot de passe 
  passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]},
    { validators: this.passwordsMatchValidator });
  
  // Message divers
  message: string = '';

  // Nouvelle variable pour stocker la liste
  bookings: BookingHistory[] = [];
  loadingBookings = true;

  // Variables pour le mot de passe
  passwordMessage: string = '';
  passwordError: string = '';

  // Méthode d'initialisation
  ngOnInit() {
    // Charger le profil
    this.userService.getProfile().subscribe({
      next: (data) => this.profileForm.patchValue(data),
      error: (err) => console.error("Erreur chargement profil", err)
    });
    // Charger l'Historique
    this.loadHistory();
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.profileForm.valid) {
      // On envoie les données (getRawValue inclut même les champs disabled comme email)
      this.userService.updateProfile(this.profileForm.getRawValue()).subscribe({
        next: () => this.message = "Profil mis à jour !",
        error: () => this.message = "Erreur lors de la mise à jour."
      });
    }
  }

  // Méthode pour charger l'historique des commandes
  loadHistory() {
    this.userService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loadingBookings = false;
      },
    error: (err) => {
      console.error("Erreur historique", err);
      this.loadingBookings = false;
      }
    });
  }

  // Méthode pour colorer le statut
  getStatusColor(status: string): string {
    switch(status) {
      case 'confirmee': return '#27ae60'; // Vert
      case 'confirmée': return '#27ae60'; // Vert
      case 'annulée': return '#c0392b';   // Rouge
      case 'en_attente': return '#f39c12'; // Orange
      default: return '#7f8c8d';
    }
  }
  
  // Méthode pour annuler une réservation
  onCancelOrder(orderId: number) {
    // Sécurité -> confirme
    if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      // Appel API
      this.userService.cancelBooking(orderId).subscribe({
        next: () => {
          // recharge la liste pour mettre à jour l'affichage
          this.loadHistory();
        },
        error: (err) => {
          console.error("Erreur annulation", err);
          alert("Impossible d'annuler cette commande.");
        }
      });

    }
  }

  // Méthode pour vérifier si une réservation peut encore être annulée
  canCancel(booking: BookingHistory): boolean {
    // Si déjà annulée, on cache le bouton
    if (booking.statut_commande === 'annulée') {
      return false;
    }

    // Récupérations de la date du jour à minuit (pour comparer équitablement)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Conversion de la chaîne de caractères (string) en objet Date
    const startDate = new Date(booking.date_sejour_debut);
    startDate.setHours(0, 0, 0, 0);

    // Retourne true si la date de début est supérieure ou égale à aujourd'hui
    return startDate >= today;
  }

  // Changement de mot de passe -> Validateur maison
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  // Méthode pour le changement de mot de passe
  onChangePassword() {
    if (this.passwordForm.valid) {
      this.userService.updatePassword({
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword
      }).subscribe({
        next: (res) => {
          this.passwordMessage = res.message;
          this.passwordError = '';
          this.passwordForm.reset();
        },
      error: (err) => {
        this.passwordError = err.error.message || "Erreur lors du changement";
        this.passwordMessage = '';
        }
      });
    }
  }
}


