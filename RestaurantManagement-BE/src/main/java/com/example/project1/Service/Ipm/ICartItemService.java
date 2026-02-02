package com.example.project1.Service.Ipm;

import com.example.project1.dto.request.CartItemRequest;
import com.example.project1.dto.response.CartItemResponse;

import java.util.List;

public interface ICartItemService {
    List<CartItemResponse> getAllCartItem();
    CartItemResponse createCartItem(CartItemRequest cartItemRequest);
    CartItemResponse updateCartItem(Integer id,CartItemRequest cartItemRequest);
    void deleteCartItem(Integer id);
    void validateMenuBeLongsToRestaurant(Integer menuId, Integer restaurantId);
}
