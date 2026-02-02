package com.example.project1.Repository;

import com.example.project1.Models.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {
    boolean existsByIdAndRestaurantId(Integer menuId, Integer restaurantId);
}
