package com.example.project1.Service.Ipm;

import com.example.project1.Models.Reservation;
import com.example.project1.dto.ReservationDTO;
import com.example.project1.dto.response.ReservationResponse;

import java.util.List;

public interface IReservationServices {
    ReservationResponse CreateReservation(ReservationDTO reservationDto);
    List<ReservationResponse> getAllReservations();
    ReservationResponse UpdateReservation(Long id, ReservationDTO reservation);
    void DeleteReservation(Long id);
    Reservation getTodoById(Long id);

}
