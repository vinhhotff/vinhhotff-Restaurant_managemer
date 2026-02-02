package com.example.project1.Controller;

import com.example.project1.Service.Ipm.ICartItemService;
import com.example.project1.dto.request.CartItemRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.CartItemResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/cartItems")
public class CartItemController {
    private ICartItemService cartItemService;
    public CartItemController(ICartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getAllCartItems() {
        List<CartItemResponse> cartItem = cartItemService.getAllCartItem();

        return ResponseEntity.ok(
                ApiResponse.success(cartItem, "Get all cartItem successfully")
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartItemResponse>> createTables(@Valid @RequestBody CartItemRequest cartItemRequest) {
        CartItemResponse cartItem = cartItemService.createCartItem(cartItemRequest);
        ApiResponse<CartItemResponse> apiResponse = ApiResponse.success(cartItem, "Create cartItem successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateTables(@PathVariable Integer id ,@Valid @RequestBody CartItemRequest cartItemRequest) {
        CartItemResponse cartItem = cartItemService.updateCartItem(id, cartItemRequest);
        ApiResponse<CartItemResponse> apiResponse = ApiResponse.success(cartItem, "Update cartItem successfully");
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemResponse>> deleteTables(@PathVariable Integer id) {
        cartItemService.deleteCartItem(id);
        return ResponseEntity.ok(
                ApiResponse.success(null, "cartItem deleted successfully")
        );
    }
}
