package com.example.project1.Service;

import com.example.project1.Models.RefreshToken;
import com.example.project1.Models.User;
import com.example.project1.Repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;


@Service
public class RefreshTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public String createRefreshToken(User user) {
        String tokenId = UUID.randomUUID().toString();
        String rawToken = UUID.randomUUID().toString();

        String hashedToken = BCrypt.hashpw(rawToken, BCrypt.gensalt());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenId(tokenId);
        refreshToken.setTokenHash(hashedToken);
        refreshToken.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));
        refreshToken.setRevoked(false);

        refreshTokenRepository.save(refreshToken);

        // Client nhận tokenId.rawToken
        return tokenId + "." + rawToken;
    }

    public Optional<RefreshToken> validateRefreshToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 2) return Optional.empty();

        String tokenId = parts[0];
        String rawToken = parts[1];

        return refreshTokenRepository
                .findByTokenIdAndRevokedFalse(tokenId)
                .filter(rt -> rt.getExpiryDate().isAfter(Instant.now()))
                .filter(rt -> BCrypt.checkpw(rawToken, rt.getTokenHash()));
    }

    public void revokeToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 2) return;

        String tokenId = parts[0];

        refreshTokenRepository.findByTokenIdAndRevokedFalse(tokenId)
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    rt.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(rt);
                });
    }

}