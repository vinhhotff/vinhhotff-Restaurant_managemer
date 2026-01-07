package com.example.project1.Controller;

import com.example.project1.Service.AuthService;
import com.example.project1.dto.request.LoginRequest;
import com.example.project1.dto.request.RefreshRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {
        AuthResponse authResponse = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>success(authResponse, "Login successful")
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @RequestBody @Valid RefreshRequest request
    ) {
        AuthResponse authResponse = authService.refresh(request.getRefreshToken());

        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>success(authResponse, "Token refreshed")
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestBody @Valid RefreshRequest request
    ) {
        authService.logout(request.getRefreshToken());

        return ResponseEntity.ok(
                ApiResponse.success(null, "Logout successful")
        );
    }
}

