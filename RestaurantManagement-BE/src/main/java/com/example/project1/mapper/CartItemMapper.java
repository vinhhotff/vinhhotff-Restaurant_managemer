package com.example.project1.mapper;

import com.example.project1.Models.CartItem;
import com.example.project1.Models.Menu;
import com.example.project1.Models.Restaurant;
import com.example.project1.Models.User;
import com.example.project1.dto.request.CartItemRequest;
import com.example.project1.dto.response.CartItemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "userFromId")
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "restaurantFromId")
    @Mapping(target = "menu", source = "menuId", qualifiedByName = "menuFromId")
    CartItem toEntity(CartItemRequest cartItemRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "userFromId")
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "restaurantFromId")
    @Mapping(target = "menu", source = "menuId", qualifiedByName = "menuFromId")
    void updateEntity(@MappingTarget CartItem cartItem, CartItemRequest cartItemRequest);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "restaurantId", source = "restaurant.id")
    @Mapping(target = "menuId", source = "menu.id")
    CartItemResponse toResponse(CartItem cartItem);

    @Named("userFromId")
    default User userFromId(Long id) {
        if (id != null) return null;
        User user = new User();
        user.setId(id);
        return user;
    }


    @Named("restaurantFromId")
    default Restaurant restaurantFromId(Integer id) {
        if (id == null) return null;
        Restaurant restaurant = new Restaurant();
        restaurant.setId(id);
        return restaurant;
    }

    @Named("menuFromId")
    default Menu menuFromId(Integer id) {
        if (id == null) return null;
        Menu menu = new Menu();
        menu.setId(id);
        return menu;
    }
}
