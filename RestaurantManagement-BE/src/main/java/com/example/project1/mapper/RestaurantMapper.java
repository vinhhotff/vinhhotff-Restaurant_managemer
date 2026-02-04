package com.example.project1.mapper;

import com.example.project1.Models.Restaurant;
import com.example.project1.dto.request.RestaurantRequest;
import com.example.project1.dto.response.RestaurantResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    Restaurant toEntity(RestaurantRequest request);

    RestaurantResponse toResponse(Restaurant restaurant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    void updateEntity(@MappingTarget Restaurant restaurant, RestaurantRequest request);
}
