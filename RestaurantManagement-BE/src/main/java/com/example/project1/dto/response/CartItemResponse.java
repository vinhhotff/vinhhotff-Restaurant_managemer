package com.example.project1.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {

    private Integer userId;
    private Integer restaurantId;
    private Integer menuId;
    private Integer quantity;
    private String specialInstructions;
    private Instant updatedAt;
}
