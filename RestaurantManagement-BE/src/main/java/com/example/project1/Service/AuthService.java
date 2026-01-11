package com.example.project1.Service;

import com.example.project1.Models.RefreshToken;
import com.example.project1.Models.User;
import com.example.project1.Repository.UserRepository;
import com.example.project1.Security.JwtUtil;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.LoginRequest;
import com.example.project1.dto.response.AuthResponse;
import com.example.project1.exception.AppException;
import com.example.project1.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(CreateUserRequest request) {
        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already exists", 409);
        }

        // Validate password is required for local registration
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new AppException("Password is required for registration", 400);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAuthProvider("local"); // Mark as local account

        userRepository.save(user);

        // Auto login after register
        String accessToken = jwtUtil.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Incorrect email or password", 200));

        // Check if user registered with OAuth (Google, Facebook, etc.)
        if (user.getAuthProvider() != null && !user.getAuthProvider().equals("local")) {
            throw new AppException("This account was registered with " + user.getAuthProvider() + ". Please use " + user.getAuthProvider() + " login.", 400);
        }

        // Validate password exists
        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new AppException("This account has no password. Please use OAuth login.", 400);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException("Incorrect email or password", 200);
        }

        String accessToken = jwtUtil.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refresh(String refreshToken) {
        RefreshToken rt = refreshTokenService.validateRefreshToken(refreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        // rotate refresh token
        refreshTokenService.revokeToken(refreshToken);
        String newRefreshToken = refreshTokenService.createRefreshToken(rt.getUser());

        String newAccessToken = jwtUtil.generateToken(rt.getUser().getEmail());

        return new AuthResponse(newAccessToken, newRefreshToken);
    }

    public void logout(String refreshToken) {

        refreshTokenService.revokeToken(refreshToken);
    }

    // Method for Google OAuth to create refresh token
    public String createRefreshTokenForUser(User user) {
        return refreshTokenService.createRefreshToken(user);
    }
}
