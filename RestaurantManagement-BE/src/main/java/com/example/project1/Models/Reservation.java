package com.example.project1.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @ColumnDefault("nextval('reservations_reservation_id_seq'")
    @Column(name = "reservation_id", nullable = false)
    private Integer id;

    @Column(name = "reservation_code", nullable = false, length = 20)
    private String reservationCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "table_id", nullable = false)
    private Tables tables;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests;

    @Column(name = "special_requests", length = Integer.MAX_VALUE)
    private String specialRequests;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "cancellation_reason", length = Integer.MAX_VALUE)
    private String cancellationReason;
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;

/*
 TODO [Reverse Engineering] create field to map the 'occasion' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @Column(name = "occasion", columnDefinition = "occasion_type")
    private Object occasion;
*/
/*
 TODO [Reverse Engineering] create field to map the 'status' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @ColumnDefault("pending")
    @Column(name = "status", columnDefinition = "reservation_status")
    private Object status;
*/
}