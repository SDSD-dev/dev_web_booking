// client/src/app/services/booking/booking.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/booking';

  createCheckoutSession(bookingData: any): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/checkout`, bookingData);
  };

  validatePayment(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/success`, { sessionId });
  }
}
