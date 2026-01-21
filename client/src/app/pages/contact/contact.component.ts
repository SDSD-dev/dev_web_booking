// client/src/app/pages/contact/contact.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  // Définition du formulaire de contact
  contactForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required], 
    email: ['', Validators.required], 
    phone: [''], 
    message: ['', Validators.required], 
    consent_public: ['', Validators.requiredTrue],
  });

  // Message de retour après soumission
  contactMessage: string = '';

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.createMessage(this.contactForm.getRawValue()).subscribe({
        next: (res) => {
          console.log("Succès", res);
          this.contactMessage = 'Message créé';
          this.contactForm.reset();
        }, 
        error: (err) => {
          console.error("Erreur", err);
          this.contactMessage = 'Erreur lors de l\'envoi';
        }, 
      })
    }
  }

}
