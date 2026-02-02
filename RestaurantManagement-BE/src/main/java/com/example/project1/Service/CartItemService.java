package com.example.project1.Service;

import com.example.project1.Models.*;
import com.example.project1.Repository.CartItemRepository;
import com.example.project1.Repository.MenuRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.Repository.UserRepository;
import com.example.project1.Service.Ipm.ICartItemService;
import com.example.project1.dto.request.CartItemRequest;
import com.example.project1.dto.response.CartItemResponse;
import com.example.project1.mapper.CartItemMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;

@Service
public class CartItemService implements ICartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final CartItemMapper cartItemMapper;
    public CartItemService(CartItemRepository cartItemRepository, UserRepository userRepository, RestaurantRepository restaurantRepository, MenuRepository menuRepository, CartItemMapper cartItemMapper) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuRepository = menuRepository;
        this.cartItemMapper = cartItemMapper;
    }
    @Override
    public List<CartItemResponse> getAllCartItem() {
        List<CartItem> cartItems = cartItemRepository.findAll();
        return cartItems.stream()
                .map(cartItemMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CartItemResponse createCartItem(CartItemRequest cartItemRequest) {

        User user = userRepository.findById(cartItemRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Restaurant restaurant = restaurantRepository.findById(cartItemRequest.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("The restaurant not found!!"));

        Menu menu = menuRepository.findById(cartItemRequest.getMenuId())
                .orElseThrow(() -> new RuntimeException(" Menu not found!!"));

        validateMenuBeLongsToRestaurant(cartItemRequest.getMenuId(), cartItemRequest.getRestaurantId());

        CartItem cartItem = cartItemRepository
                .findByUser_IdAndMenu_Id(cartItemRequest.getUserId(), cartItemRequest.getMenuId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + cartItemRequest.getQuantity());
                    existing.setSpecialInstructions(cartItemRequest.getSpecialInstructions()); // nếu muốn cập nhật
                    return existing;
                })
                .orElseGet(() -> {
                    CartItem ci = cartItemMapper.toEntity(cartItemRequest);
                    ci.setUser(user);
                    ci.setRestaurant(restaurant);
                    ci.setMenu(menu);
                    ci.setCreatedAt(Instant.now());
                    return ci;
                });

        CartItem cartItemSaved = cartItemRepository.save(cartItem);
        return cartItemMapper.toResponse(cartItemSaved);
    }

    @Override
    public CartItemResponse updateCartItem(Integer id, CartItemRequest cartItemRequest) {

        CartItem cartItemFind = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem Not Found"));

        User user = userRepository.findById(cartItemRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Restaurant restaurant = restaurantRepository.findById(cartItemRequest.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("The restaurant not found!!"));

        Menu menu = menuRepository.findById(cartItemRequest.getMenuId())
                .orElseThrow(() -> new RuntimeException(" Menu not found!!"));

        validateMenuBeLongsToRestaurant(cartItemRequest.getMenuId(), cartItemRequest.getRestaurantId());

        cartItemMapper.updateEntity(cartItemFind, cartItemRequest);
        cartItemFind.setUser(user);
        cartItemFind.setRestaurant(restaurant);
        cartItemFind.setMenu(menu);
        cartItemFind.setUpdatedAt(Instant.now());
        CartItem cartItemSaved = cartItemRepository.save(cartItemFind);
        return cartItemMapper.toResponse(cartItemSaved);
    }

    @Override
    public void deleteCartItem(Integer id) {
        CartItem cartItemFind = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem Not Found"));

        cartItemRepository.delete(cartItemFind);
    }

    @Override
    public void validateMenuBeLongsToRestaurant(Integer menuId, Integer restaurantId) {
        boolean isValid = menuRepository.existsByIdAndRestaurantId(menuId, restaurantId);
        if(!isValid){
            throw new RuntimeException("Menu  not belong to restaurant");
        }
    }
}
