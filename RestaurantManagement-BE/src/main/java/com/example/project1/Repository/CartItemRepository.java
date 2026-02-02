package com.example.project1.Repository;

import com.example.project1.Models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByUser_IdAndMenu_Id(Long userId, Integer menuId);
    List<CartItem> findByUser_Id(Long userId);
    void deleteAllByUser_Id(Long userId);
}
