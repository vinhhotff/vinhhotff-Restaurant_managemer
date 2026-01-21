package com.example.project1.mapper;

import com.example.project1.Models.Restaurant;
import com.example.project1.Models.RestaurantArea;
import com.example.project1.Models.Tables;
import com.example.project1.dto.request.TableRequest;
import com.example.project1.dto.response.TableResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;


@Mapper(componentModel = "spring")
public interface TableMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "restaurantFromId")
    @Mapping(target = "area", source = "areaId", qualifiedByName = "areaFromId")
    Tables toEntity(TableRequest tableRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "restaurantFromId")
    @Mapping(target = "area", source = "areaId", qualifiedByName = "areaFromId")
    void updateEntity(@MappingTarget Tables table, TableRequest tableRequest);

    @Mapping(target = "restaurantId", source = "restaurant.id")
    @Mapping(target = "areaId", source = "area.id")
    @Mapping(target = "areaName", source = "area.name")
    TableResponse toResponse(Tables table);

    @Named("restaurantFromId")
    default Restaurant restaurantFromId(Integer id) {
        if (id == null) return null;
        Restaurant restaurant = new Restaurant();
        restaurant.setId(id);
        return restaurant;
    }

    @Named("areaFromId")
    default RestaurantArea areaFromId(Integer id) {
        if (id == null) return null;
        RestaurantArea area = new RestaurantArea();
        area.setId(id);
        return area;
    }
}
