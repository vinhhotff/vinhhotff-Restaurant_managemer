package com.example.project1.Repository;

import com.example.project1.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findById(Long id);
    Optional<User> findByAuthProviderAndProviderId(String authProvider, String providerId);
}
