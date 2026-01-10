package com.example.project1.Repository;
import com.example.project1.Models.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    // JpaRepository đã có sẵn các hàm findAll, findById, save, deleteById rồi
}