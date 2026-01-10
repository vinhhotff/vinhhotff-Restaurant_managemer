package com.example.project1.dto.request;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Map;
@Data
public class CreateRestaurantRequest {
    @NotNull(message = "Owner ID is required")
    private Integer ownerId; // ID của chủ nhà hàng
    @NotBlank(message = "Name is required")
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
    private Map<String, Object> gallery;
    private Map<String, Object> features;
}