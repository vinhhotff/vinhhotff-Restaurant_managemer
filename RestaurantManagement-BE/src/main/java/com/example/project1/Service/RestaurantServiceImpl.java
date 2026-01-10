package com.example.project1.Service;
import com.example.project1.Models.Restaurant;
import com.example.project1.Models.RestaurantOwner;
import com.example.project1.Repository.RestaurantOwnerRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.dto.request.CreateRestaurantRequest;
import com.example.project1.dto.request.UpdateRestaurantRequest;
import com.example.project1.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantOwnerRepository restaurantOwnerRepository;
    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
    @Override
    public Restaurant getRestaurantById(Integer id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new AppException("Restaurant not found", 404));
    }
    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest request) {
        RestaurantOwner owner = restaurantOwnerRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new AppException("Restaurant Owner not found", 404));
        Restaurant restaurant = new Restaurant();
        restaurant.setOwner(owner);
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setCity(request.getCity());
        restaurant.setDistrict(request.getDistrict());
        restaurant.setWard(request.getWard());
        restaurant.setLatitude(request.getLatitude());
        restaurant.setLongitude(request.getLongitude());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());
        restaurant.setWebsite(request.getWebsite());
        restaurant.setOpeningHours(request.getOpeningHours());
        restaurant.setPriceRange(request.getPriceRange());
        restaurant.setCoverImage(request.getCoverImage());
        restaurant.setGallery(request.getGallery());
        restaurant.setFeatures(request.getFeatures());
        return restaurantRepository.save(restaurant);
    }
    @Override
    public Restaurant updateRestaurant(Integer id, UpdateRestaurantRequest request) {
        Restaurant restaurant = getRestaurantById(id);
        if (request.getName() != null) restaurant.setName(request.getName());
        if (request.getDescription() != null) restaurant.setDescription(request.getDescription());
        if (request.getAddress() != null) restaurant.setAddress(request.getAddress());
        if (request.getCity() != null) restaurant.setCity(request.getCity());
        if (request.getDistrict() != null) restaurant.setDistrict(request.getDistrict());
        if (request.getWard() != null) restaurant.setWard(request.getWard());
        if (request.getLatitude() != null) restaurant.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) restaurant.setLongitude(request.getLongitude());
        if (request.getPhone() != null) restaurant.setPhone(request.getPhone());
        if (request.getEmail() != null) restaurant.setEmail(request.getEmail());
        if (request.getWebsite() != null) restaurant.setWebsite(request.getWebsite());
        if (request.getOpeningHours() != null) restaurant.setOpeningHours(request.getOpeningHours());
        if (request.getPriceRange() != null) restaurant.setPriceRange(request.getPriceRange());
        if (request.getCoverImage() != null) restaurant.setCoverImage(request.getCoverImage());
        if (request.getGallery() != null) restaurant.setGallery(request.getGallery());
        if (request.getFeatures() != null) restaurant.setFeatures(request.getFeatures());
        restaurant.setUpdatedAt(Instant.now());
        return restaurantRepository.save(restaurant);
    }
    @Override
    public void deleteRestaurant(Integer id) {
        if (!restaurantRepository.existsById(id)) {
            throw new AppException("Restaurant not found", 404);
        }
        restaurantRepository.deleteById(id);
    }
}