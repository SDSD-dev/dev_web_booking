// src/app/interfaces/hotel.model.ts

// interface 'hotel'
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

// interface 'room'
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

// interface 'HotelDetailResponse'
export interface HotelDetailResponse {
  hotel: Hotel;
  chambres: Room[];
}

// interface 'pagination'
export interface PaginatedHotelResponse {
  hotels: Hotel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}