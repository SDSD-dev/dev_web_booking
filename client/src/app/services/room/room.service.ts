// src/app/services/room/room.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../services/hotel.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private http = inject(HttpClient);

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`/api/rooms/${id}`);
  }
};
