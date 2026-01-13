// src/app/pages/profile/profile.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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

  ngOnInit() {
    // 1. Charger les infos existantes
    this.userService.getProfile().subscribe({
      next: (data) => {
        // 2. Remplir le formulaire
        this.profileForm.patchValue(data);
      },
      error: (err) => console.error("Erreur chargement profil", err)
    });
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
}