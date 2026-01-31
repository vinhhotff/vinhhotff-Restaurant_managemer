package com.example.project1.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {

    @NotNull(message = "UserId not null")
    private Integer userId;
    @NotNull(message = "UserId not null")
    private Integer restaurantId;
    @NotNull(message = "UserId not null")
    private Integer menuId;
    @NotNull(message = "UserId not null")
    private Integer quantity;
    private String specialInstructions;

}
