import { Injectable, inject } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth'; // Grâce au proxy !

  login(credentials: any): Observable<any> {
    // On envoie email + password au serveur
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
