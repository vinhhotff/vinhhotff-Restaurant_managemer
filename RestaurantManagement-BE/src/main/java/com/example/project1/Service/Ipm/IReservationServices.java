package com.example.project1.Service.Ipm;

import com.example.project1.dto.request.ReservationDTO;
import com.example.project1.dto.response.ReservationResponse;

import java.util.List;

public interface IReservationServices {
    ReservationResponse CreateReservation(ReservationDTO reservationDto);

    List<ReservationResponse> getAllReservations();

    ReservationResponse UpdateReservation(Long id, ReservationDTO reservation);

    void DeleteReservation(Long id);

    ReservationResponse getReservationById(Long id);

}
