package com.example.project1.Repository;

import com.example.project1.Models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository  extends JpaRepository<Reservation, Long> {
    boolean existsByReservationCode(String reservationCode);
}