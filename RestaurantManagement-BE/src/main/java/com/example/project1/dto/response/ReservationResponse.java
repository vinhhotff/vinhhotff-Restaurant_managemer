package com.example.project1.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String reservationCode;
    private Long userId;
    private String userFullName;
    private Integer restaurantId;
    private String restaurantName;
    private Integer tableId;
    private String tableName;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer numberOfGuests;
    private String specialRequests;
    private Instant createdAt;
    private Instant updatedAt;
}
