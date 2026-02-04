package com.example.project1.Controller;

import com.example.project1.Service.Ipm.IRestaurantService;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.request.RestaurantRequest;
import com.example.project1.dto.response.RestaurantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final IRestaurantService restaurantService;

    @GetMapping
    public ApiResponse<List<RestaurantResponse>> getAllRestaurants() {
        return ApiResponse.<List<RestaurantResponse>>builder()
                .result(restaurantService.getAllRestaurants())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<RestaurantResponse> getRestaurantById(@PathVariable Integer id) {
        return ApiResponse.<RestaurantResponse>builder()
                .result(restaurantService.getRestaurantById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<RestaurantResponse> createRestaurant(@RequestBody @Valid RestaurantRequest request) {
        return ApiResponse.<RestaurantResponse>builder()
                .result(restaurantService.createRestaurant(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<RestaurantResponse> updateRestaurant(@PathVariable Integer id,
            @RequestBody @Valid RestaurantRequest request) {
        return ApiResponse.<RestaurantResponse>builder()
                .result(restaurantService.updateRestaurant(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRestaurant(@PathVariable Integer id) {
        restaurantService.deleteRestaurant(id);
        return ApiResponse.<Void>builder()
                .message("Restaurant deleted successfully")
                .build();
    }
}
