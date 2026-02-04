package com.example.project1.Service.Ipm;

import com.example.project1.Models.User;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.dto.response.ReservationResponse;
import com.example.project1.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IUserService {
    Page<UserResponse> getAllUsers(Pageable pageable);

    Page<UserResponse> getUsers(String keyword, Boolean isVerified, String authProvider, Pageable pageable);

    User getUserById(Long id);

    List<ReservationResponse> getUserReservations(Long userId);

    UserResponse createUser(CreateUserRequest request);

    void deleteUser(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest request);
}
