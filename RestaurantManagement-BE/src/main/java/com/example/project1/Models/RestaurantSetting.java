package com.example.project1.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "restaurant_settings")
public class RestaurantSetting {
    @Id
    @ColumnDefault("nextval('restaurant_settings_setting_id_seq'")
    @Column(name = "setting_id", nullable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ColumnDefault("30")
    @Column(name = "advance_booking_days")
    private Integer advanceBookingDays;

    @ColumnDefault("2")
    @Column(name = "min_booking_hours")
    private Integer minBookingHours;

    @ColumnDefault("3")
    @Column(name = "max_booking_period")
    private Integer maxBookingPeriod;

    @ColumnDefault("true")
    @Column(name = "allow_walk_in")
    private Boolean allowWalkIn;

    @ColumnDefault("false")
    @Column(name = "require_deposit")
    private Boolean requireDeposit;

    @ColumnDefault("0")
    @Column(name = "deposit_percentage", precision = 5, scale = 2)
    private BigDecimal depositPercentage;

    @Column(name = "cancellation_policy", length = Integer.MAX_VALUE)
    private String cancellationPolicy;

    @ColumnDefault("false")
    @Column(name = "auto_confirm_bookings")
    private Boolean autoConfirmBookings;

    @ColumnDefault("20")
    @Column(name = "max_guests_per_booking")
    private Integer maxGuestsPerBooking;

}