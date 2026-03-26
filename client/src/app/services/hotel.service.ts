// src/app/services/hotel.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// 'hotel'
export interface Hotel {
  id_hotel: number;
  name: string;
  address: string;
  city: string;
  description_hotel: string;
  cover_image?: string; // ? signifie qu'il peut être null si pas d'image
  prix_base?: number; // Le prix minimum trouvé
  average_rating?: number | string; // La note SQL (souvent renvoyée en string par le driver MySQL)
  review_count?: number; // Nombre d'avis
  piscine?: number;
  spa?: number;
  animaux?: number;
  wifi?: number;
  parking?: number;
}
// 'room'
export interface Room {
  id_chambre : number;
  type_chambre: string;
  capacite_max: number;
  nombre_total_unites: number;
  prix_base: number;
  prix_enfant_sup?: number;
  description_chambre?: string;
  reduction_pourcentage?: string;
  date_fin_promo?: Date;
  image_room?: string;
}
// 'HotelDetailResponse'
export interface HotelDetailResponse {
  hotel: Hotel;
  chambres: Room[];
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private http = inject(HttpClient);
  private apiUrl = '/api/hotels';

  lastSearchCriteria: any = null;

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('/api/hotels');
  }

  getHotelById(id: number, dateDebut?: string | null, dateFin?: string | null): Observable<HotelDetailResponse> {
    let params = new HttpParams();
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);
    return this.http.get<HotelDetailResponse>(`/api/hotels/${id}`, { params: params });
  }

  searchHotels(criteria: any): Observable<Hotel[]> {

    this.lastSearchCriteria = criteria; // Save des critères de recherche

    let params = new HttpParams();
    
    if (criteria.city) params = params.set('city', criteria.city);
    if (criteria.dateDebut) params = params.set('dateDebut', criteria.dateDebut);
    if (criteria.dateFin) params = params.set('dateFin', criteria.dateFin);
    if (criteria.adults) params = params.set('adults', criteria.adults);
    if (criteria.children) params = params.set('children', criteria.children);
    //options
    if (criteria.piscine) params = params.set('piscine', 'true');
    if (criteria.spa) params = params.set('spa', 'true');
    if (criteria.animaux) params = params.set('animaux', 'true');
    if (criteria.wifi) params = params.set('wifi', 'true');
    if (criteria.parking) params = params.set('parking', 'true');

    return this.http.get<Hotel[]>('/api/hotels/search', { params: params })
  };

  createHotel(data: any): Observable<any> {
    // return this.http.post(this.apiUrl, data);
    return this.http.post('/api/hotels', data);
  }

  updateHotel(id: number, data: any): Observable<any> {
    // return this.http.put(`${this.apiUrl}/${id}`,data);
    return this.http.put(`/api/hotels/${id}`, data);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}


