package com.example.project1.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @ColumnDefault("nextval('reviews_review_id_seq'")
    @Column(name = "review_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "comment", length = Integer.MAX_VALUE)
    private String comment;

    @Column(name = "food_rating")
    private Integer foodRating;

    @Column(name = "service_rating")
    private Integer serviceRating;

    @Column(name = "ambiance_rating")
    private Integer ambianceRating;

    @Column(name = "photos")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> photos;

    @ColumnDefault("false")
    @Column(name = "is_verified_booking")
    private Boolean isVerifiedBooking;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;

/*
 TODO [Reverse Engineering] create field to map the 'status' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @ColumnDefault("pending")
    @Column(name = "status", columnDefinition = "review_status")
    private Object status;
*/
}