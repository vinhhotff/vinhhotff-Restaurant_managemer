package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "restaurant_stats")
public class RestaurantStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "stat_date", nullable = false)
    private LocalDate statDate;

    @ColumnDefault("0")
    @Column(name = "total_bookings")
    private Integer totalBookings = 0;

    @ColumnDefault("0")
    @Column(name = "total_revenue", precision = 15, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @ColumnDefault("0")
    @Column(name = "cancel_rate", precision = 5, scale = 2)
    private BigDecimal cancelRate = BigDecimal.ZERO;
}
