// client/src/app/services/user/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface BookingHistory {
  id_commande: number;
  date_commande: string;
  date_sejour_debut: string;
  date_sejour_fin: string;
  montant_total: number;
  statut_commande: string;
  hotel_name: string;
  hotel_city: string;
  id_hotel: number;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/profile';

  getProfile(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }

  getBookings(): Observable<BookingHistory[]> {
    return this.http.get<BookingHistory[]>(`${this.apiUrl}/bookings`);
  }

  cancelBooking(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${orderId}/cancel`, {})
  }
}
