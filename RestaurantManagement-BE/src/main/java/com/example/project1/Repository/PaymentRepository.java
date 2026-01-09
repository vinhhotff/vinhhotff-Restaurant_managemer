package com.example.project1.Repository;

import com.example.project1.Models.Payment;
import com.example.project1.Models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    boolean existsByReservation(Reservation reservation);
    long countByReservation(Reservation reservation);
}
