package com.example.project1.dto.request;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;
@Data
public class UpdateRestaurantRequest {
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
    private String coverImage;
    private Map<String, Object> gallery;
    private Map<String, Object> features;
}