package com.example.project1.Service.Ipm;

import com.example.project1.Models.User;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.LoginRequest;
import com.example.project1.dto.response.AuthResponse;

public interface IAuthService {
    AuthResponse register(CreateUserRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);

    String createRefreshTokenForUser(User user);
}
