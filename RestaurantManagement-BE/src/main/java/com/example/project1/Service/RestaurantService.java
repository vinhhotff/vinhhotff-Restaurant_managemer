package com.example.project1.Service;

import com.example.project1.Models.Restaurant;
import com.example.project1.Models.RestaurantOwner;
import com.example.project1.Repository.RestaurantOwnerRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.Service.Ipm.IRestaurantService;
import com.example.project1.dto.request.RestaurantRequest;
import com.example.project1.dto.response.RestaurantResponse;
import com.example.project1.exception.AppException;
import com.example.project1.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService implements IRestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantOwnerRepository restaurantOwnerRepository;
    private final RestaurantMapper restaurantMapper;

    @Override
    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(restaurantMapper::toResponse)
                .toList();
    }

    @Override
    public RestaurantResponse getRestaurantById(Integer id) {
        return restaurantRepository.findById(id)
                .map(restaurantMapper::toResponse)
                .orElseThrow(() -> new AppException("Restaurant not found with ID: " + id, 404));
    }

    @Override
    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        RestaurantOwner owner = restaurantOwnerRepository.findById(request.getOwnerId())
                .orElseThrow(
                        () -> new AppException("Restaurant Owner not found with ID: " + request.getOwnerId(), 404));

        Restaurant restaurant = restaurantMapper.toEntity(request);
        restaurant.setOwner(owner);
        restaurant.setCreatedAt(Instant.now());
        restaurant.setUpdatedAt(Instant.now());

        return restaurantMapper.toResponse(restaurantRepository.save(restaurant));
    }

    @Override
    public RestaurantResponse updateRestaurant(Integer id, RestaurantRequest request) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new AppException("Restaurant not found with ID: " + id, 404));

        RestaurantOwner owner = restaurantOwnerRepository.findById(request.getOwnerId())
                .orElseThrow(
                        () -> new AppException("Restaurant Owner not found with ID: " + request.getOwnerId(), 404));

        restaurantMapper.updateEntity(restaurant, request);
        restaurant.setOwner(owner);
        restaurant.setUpdatedAt(Instant.now());

        return restaurantMapper.toResponse(restaurantRepository.save(restaurant));
    }

    @Override
    public void deleteRestaurant(Integer id) {
        if (!restaurantRepository.existsById(id)) {
            throw new AppException("Restaurant not found with ID: " + id, 404);
        }
        restaurantRepository.deleteById(id);
    }
}
