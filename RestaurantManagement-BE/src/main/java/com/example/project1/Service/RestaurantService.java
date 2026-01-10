package com.example.project1.Service;
import com.example.project1.Models.Restaurant;
import com.example.project1.dto.request.CreateRestaurantRequest;
import com.example.project1.dto.request.UpdateRestaurantRequest;
import java.util.List;
public interface RestaurantService {
    List<Restaurant> getAllRestaurants();
    Restaurant getRestaurantById(Integer id);
    Restaurant createRestaurant(CreateRestaurantRequest request);
    Restaurant updateRestaurant(Integer id, UpdateRestaurantRequest request);
    void deleteRestaurant(Integer id);
}