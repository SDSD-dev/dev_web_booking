// src/app/pages/profile/profile.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
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

  message: string = '';

  // Nouvelle variable pour stocker la liste
  bookings: BookingHistory[] = [];
  loadingBookings = true;

  ngOnInit() {
    // Charger le profil
    this.userService.getProfile().subscribe({
      next: (data) => this.profileForm.patchValue(data),
      error: (err) => console.error("Erreur chargement profil", err)
    });
    // Charger l'Historique
    this.loadHistory();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // On envoie les données (getRawValue inclut même les champs disabled comme email)
      this.userService.updateProfile(this.profileForm.getRawValue()).subscribe({
        next: () => this.message = "Profil mis à jour !",
        error: () => this.message = "Erreur lors de la mise à jour."
      });
    }
  }

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
      case 'annulee': return '#c0392b';   // Rouge
      case 'en_attente': return '#f39c12'; // Orange
      default: return '#7f8c8d';
    }
  }
  
}


