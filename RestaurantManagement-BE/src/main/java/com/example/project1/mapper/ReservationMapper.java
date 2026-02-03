package com.example.project1.mapper;

import com.example.project1.Models.Reservation;
import com.example.project1.Models.Restaurant;
import com.example.project1.Models.Tables;
import com.example.project1.Models.User;
import com.example.project1.dto.request.ReservationDTO;
import com.example.project1.dto.response.ReservationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "userFromId")
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "restaurantFromId")
    @Mapping(target = "tables", source = "tableId", qualifiedByName = "tableFromId")
    Reservation toEntity(ReservationDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "userFromId")
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "restaurantFromId")
    @Mapping(target = "tables", source = "tableId", qualifiedByName = "tableFromId")
    void updateEntity(@MappingTarget Reservation reservation, ReservationDTO dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    @Mapping(target = "restaurantId", source = "restaurant.id")
    @Mapping(target = "restaurantName", source = "restaurant.name")
    @Mapping(target = "tableId", source = "tables.id")
    @Mapping(target = "tableName", expression = "java(reservation.getTables().getTableName() != null ? reservation.getTables().getTableName() : reservation.getTables().getTableNumber())")
    ReservationResponse toResponse(Reservation reservation);

    @Named("userFromId")
    default User userFromId(Long id) {
        if (id == null)
            return null;
        User user = new User();
        user.setId(id);
        return user;
    }

    @Named("restaurantFromId")
    default Restaurant restaurantFromId(Integer id) {
        if (id == null)
            return null;
        Restaurant restaurant = new Restaurant();
        restaurant.setId(id);
        return restaurant;
    }

    @Named("tableFromId")
    default Tables tableFromId(Integer id) {
        if (id == null)
            return null;
        Tables table = new Tables();
        table.setId(id);
        return table;
    }
}
