import api from "@/lib/api";
import { Reservation, ReservationDTO, ApiResponse } from "@/lib/types";

export const ReservationService = {
  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await api.get<ApiResponse<Reservation[]>>("/reservations");
    return response.data.data;
  },

  createReservation: async (data: ReservationDTO): Promise<Reservation> => {
    const response = await api.post<ApiResponse<Reservation>>("/reservations", data);
    return response.data.data;
  },

  updateReservation: async (id: number, data: Partial<ReservationDTO>): Promise<Reservation> => {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}`, data); // Controller uses PUT
    return response.data.data;
  },

  deleteReservation: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/reservations/${id}`);
  },
};
