package com.example.project1.dto.response;

import com.example.project1.Models.Enums.RestaurantStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {
    private Integer id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String district;
    private String ward;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String email;
    private String website;
    private Map<String, Object> openingHours;
    private String priceRange;
    private BigDecimal rating;
    private Integer totalReviews;
    private String coverImage;
    private Object gallery;
    private Object features;
    private RestaurantStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
