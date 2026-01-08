package com.example.project1.Controller;

import com.example.project1.Service.AuthService;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.LoginRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<Void>> register(
                        @RequestBody @Valid CreateUserRequest request) {
                AuthResponse authResponse = authService.register(request);

                ResponseCookie accessCookie = ResponseCookie.from("accessToken", authResponse.getAccessToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(24 * 60 * 60)
                                .build();

                ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(7 * 24 * 60 * 60)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(ApiResponse.success(null, "User registered successfully"));
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<Void>> login(
                        @RequestBody @Valid LoginRequest request) {
                AuthResponse authResponse = authService.login(request);

                ResponseCookie accessCookie = ResponseCookie.from("accessToken", authResponse.getAccessToken())
                                .httpOnly(true)
                                .secure(false) // Set to true in production
                                .path("/")
                                .maxAge(24 * 60 * 60) // 1 day
                                .build();

                ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                                .httpOnly(true)
                                .secure(false) // Set to true in production
                                .path("/")
                                .maxAge(7 * 24 * 60 * 60) // 7 days
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(ApiResponse.success(null, "Login successful"));
        }

        @PostMapping("/refresh")
        public ResponseEntity<ApiResponse<Void>> refresh(
                        @CookieValue(name = "refreshToken", required = false) String refreshToken) {
                if (refreshToken == null) {
                        return ResponseEntity.status(401)
                                        .body(ApiResponse.error("Refresh Token not found in cookies", 401));
                }

                AuthResponse authResponse = authService.refresh(refreshToken);

                ResponseCookie accessCookie = ResponseCookie.from("accessToken", authResponse.getAccessToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(24 * 60 * 60)
                                .build();

                ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(7 * 24 * 60 * 60)
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(ApiResponse.success(null, "Token refreshed"));
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<Void>> logout(
                        @CookieValue(name = "refreshToken", required = false) String refreshToken) {
                if (refreshToken != null) {
                        authService.logout(refreshToken);
                }

                ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(0) // Clear cookie
                                .build();

                ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(0) // Clear cookie
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(ApiResponse.success(null, "Logout successful"));
        }
}
