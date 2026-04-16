// src/app/services/hotel.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedHotelResponse, Hotel, Room, HotelDetailResponse } from '../interfaces/hotel.model';


@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private http = inject(HttpClient);
  private apiUrl = '/api/hotels';

  lastSearchCriteria: any = null;

  // méthode pour récupérer les hôtels avec pagination
  getHotels(page: number = 1, limit: number = 4): Observable<PaginatedHotelResponse> {
    return this.http.get<PaginatedHotelResponse>(`/api/hotels?page=${page}&limit=${limit}`);
  }

  // méthode pour récupérer les détails d'un hôtel, avec possibilité de filtrer par date
  getHotelById(id: number, dateDebut?: string | null, dateFin?: string | null): Observable<HotelDetailResponse> {
    let params = new HttpParams();
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);
    return this.http.get<HotelDetailResponse>(`/api/hotels/${id}`, { params: params });
  }

  // méthode de recherche d'hôtels avec critères avancés
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

  // Méthodes d'administration
  createHotel(data: any): Observable<any> {
    return this.http.post('/api/hotels', data);
  }

  // Méthode pour mettre à jour un hôtel, en envoyant les données modifiées
  updateHotel(id: number, data: any): Observable<any> {
    return this.http.put(`/api/hotels/${id}`, data);
  }

  // Méthode pour supprimer un hôtel en utilisant son ID
  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}


