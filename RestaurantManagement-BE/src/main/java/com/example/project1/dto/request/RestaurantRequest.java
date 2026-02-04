package com.example.project1.dto.request;

import com.example.project1.Models.Enums.RestaurantStatus;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequest {
    @NotNull(message = "Owner ID is required")
    private Integer ownerId;

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
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
    private Object gallery;
    private Object features;
    private RestaurantStatus status;
}
