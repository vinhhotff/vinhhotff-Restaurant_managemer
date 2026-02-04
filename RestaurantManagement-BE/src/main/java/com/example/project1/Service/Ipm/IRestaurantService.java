package com.example.project1.Service.Ipm;

import com.example.project1.dto.request.RestaurantRequest;
import com.example.project1.dto.response.RestaurantResponse;

import java.util.List;

public interface IRestaurantService {
    List<RestaurantResponse> getAllRestaurants();

    RestaurantResponse getRestaurantById(Integer id);

    RestaurantResponse createRestaurant(RestaurantRequest request);

    RestaurantResponse updateRestaurant(Integer id, RestaurantRequest request);

    void deleteRestaurant(Integer id);
}
