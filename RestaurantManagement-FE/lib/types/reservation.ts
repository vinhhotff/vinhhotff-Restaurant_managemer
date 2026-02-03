import type { ApiResponse } from "./api";

export type Occasion = "birthday" | "anniversary" | "business" | "date" | "other";

export interface ReservationDTO {
  reservationCode?: string;
  userId: number;
  restaurantId: number;
  tableId: number;
  reservationDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  numberOfGuests: number;
  specialRequests?: string;
  occasion?: Occasion;
}

export interface ReservationResponse {
  id: number;
  reservationCode: string;
  userId: number;
  userFullName: string;
  restaurantId: number;
  restaurantName: string;
  tableId: number;
  tableName: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationListResponse = ApiResponse<ReservationResponse[]>;
export type ReservationDetailResponse = ApiResponse<ReservationResponse>;
