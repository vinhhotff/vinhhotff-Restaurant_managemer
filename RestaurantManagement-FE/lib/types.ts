export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  profileImage?: string;
  authProvider?: string;
  role?: string;
}

export interface Reservation {
  id: number;
  userId: number; // or User object depending on backend
  restaurantId: number;
  reservationTime: string;
  guestCount: number;
  status: string;
  notes?: string;
  createdAt?: string;
}

export interface ReservationDTO {
  restaurantId: number;
  reservationTime: string; // ISO string
  guestCount: number;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode?: number;
}
