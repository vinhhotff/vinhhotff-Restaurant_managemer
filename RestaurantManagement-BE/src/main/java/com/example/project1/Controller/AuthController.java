package com.example.project1.Controller;

import com.example.project1.Models.User;
import com.example.project1.Service.AuthService;
import com.example.project1.Service.GoogleOAuthService;
import com.example.project1.Security.JwtUtil;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.GoogleTokenRequest;
import com.example.project1.dto.request.LoginRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.AuthResponse;
import com.example.project1.dto.response.GoogleUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;
        private final GoogleOAuthService googleOAuthService;
        private final JwtUtil jwtUtil;

        @Value("${spring.security.oauth2.client.registration.google.client-id}")
        private String googleClientId;

        @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
        private String redirectUri;

        @Value("${spring.security.oauth2.client.provider.google.authorization-uri}")
        private String authorizationUri;

        private static final String FRONTEND_SUCCESS_URL = "http://localhost:3000/auth/success";

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


        @GetMapping("/google/login")
        public RedirectView initiateGoogleLogin() {
                String scope = URLEncoder.encode("email profile", StandardCharsets.UTF_8);
                String redirect = redirectUri.replace("{baseUrl}", "http://localhost:8080");
                String encodedRedirect = URLEncoder.encode(redirect, StandardCharsets.UTF_8);
                
                String googleAuthUrl = authorizationUri +
                        "?client_id=" + googleClientId +
                        "&redirect_uri=" + encodedRedirect +
                        "&response_type=code" +
                        "&scope=" + scope +
                        "&access_type=offline" +
                        "&prompt=consent";
                
                return new RedirectView(googleAuthUrl);
        }


        @GetMapping("/google/callback")
        public void handleGoogleCallback(
                @RequestParam("code") String code,
                @RequestParam(value = "state", required = false) String state,
                HttpServletResponse response) throws IOException {
                
                try {
                        // Exchange authorization code for access token and get user info
                        GoogleUserInfo googleUserInfo = googleOAuthService.exchangeCodeForUserInfo(code);
                        
                        // Create or update user in database
                        User user = googleOAuthService.processGoogleUser(googleUserInfo);
                        
                        // Generate JWT tokens
                        String accessToken = jwtUtil.generateToken(user.getEmail());
                        String refreshToken = authService.createRefreshTokenForUser(user);

                        // Set cookies
                        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(24 * 60 * 60)
                                .build();

                        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(7 * 24 * 60 * 60)
                                .build();

                        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
                        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

                        // Redirect to frontend success page or return JSON
                        // Option 1: Redirect to frontend
                        // response.sendRedirect(FRONTEND_SUCCESS_URL);
                        
                        // Option 2: Return JSON with user info
                        response.setContentType("application/json");
                        response.setCharacterEncoding("UTF-8");
                        String jsonResponse = String.format(
                                "{\"user\":{\"id\":\"%s\",\"email\":\"%s\",\"name\":\"%s\",\"avatarUrl\":\"%s\",\"provider\":\"%s\"},\"token\":\"%s\"}",
                                user.getId(),
                                user.getEmail(),
                                user.getFullName(),
                                user.getProfileImage() != null ? user.getProfileImage() : "",
                                user.getAuthProvider() != null ? user.getAuthProvider() : "google",
                                accessToken
                        );
                        response.getWriter().write(jsonResponse);
                        
                } catch (Exception e) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"Google authentication failed: " + 
                                e.getMessage().replace("\"", "'") + "\"}");
                }
        }
}
