// src/app/services/hotel.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// on definit 'hotel'
export interface Hotel {
  id_hotel: number;
  name: string;
  address: string;
  city: string;
  description_hotel: string;
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private http = inject(HttpClient);

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('/api/hotels');
  }
}
