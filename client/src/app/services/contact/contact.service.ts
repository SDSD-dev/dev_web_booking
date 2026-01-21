// client/src/app/services/contact/contact.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Définition de l'interface message
export interface message {
  nom: string,
  prenom: string, 
  email: string, 
  phone: number, 
  message: string, 
  consent_public: number,
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  // Méthode pour créer un nouveau message de contact
  createMessage(newMessage: message):Observable<message> {
    return this.http.post<message>('/api/contact',newMessage);
  }
}


