package com.example.project1.Controller;
import com.example.project1.Service.Ipm.IReservationServices;
import com.example.project1.dto.ReservationDTO;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.ReservationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final IReservationServices reservationServices;
    public ReservationController(IReservationServices reservationServices) {
        this.reservationServices = reservationServices;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations() {
        List<ReservationResponse> reservations = reservationServices.getAllReservations();

        return ResponseEntity.ok(
                ApiResponse.success(reservations, "Get all reservations successfully")
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(@Valid @RequestBody ReservationDTO reservationDTO) {
        ReservationResponse reservation = reservationServices.CreateReservation(reservationDTO);
        ApiResponse<ReservationResponse> response = ApiResponse.success(reservation, "Reservation created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservation(@PathVariable Long id, @Valid @RequestBody ReservationDTO reservationDTO) {
        ReservationResponse reservation = reservationServices.UpdateReservation(id, reservationDTO);
        ApiResponse<ReservationResponse> response = ApiResponse.success(reservation, "Reservation updated successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(@PathVariable Long id) {
        reservationServices.DeleteReservation(id);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Reservation deleted successfully")
        );
    }
}
