package com.example.project1.Service;

import com.example.project1.Models.User;
import com.example.project1.Repository.UserRepository;
import com.example.project1.dto.response.GoogleUserInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleOAuthService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.provider.google.token-uri}")
    private String tokenUri;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    private String userInfoUri;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    /**
     * Verify Google ID Token and extract user information
     */
    public GoogleUserInfo verifyGoogleToken(String idToken) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken googleIdToken = verifier.verify(idToken);
        if (googleIdToken == null) {
            throw new IllegalArgumentException("Invalid ID token");
        }

        GoogleIdToken.Payload payload = googleIdToken.getPayload();

        return GoogleUserInfo.builder()
                .sub(payload.getSubject())
                .email(payload.getEmail())
                .name((String) payload.get("name"))
                .picture((String) payload.get("picture"))
                .emailVerified(payload.getEmailVerified())
                .build();
    }

    /**
     * Process Google login - create or update user
     */
    @Transactional
    public User processGoogleUser(GoogleUserInfo googleUserInfo) {
        Optional<User> existingUser = userRepository.findByEmail(googleUserInfo.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update existing user with Google info
            if (user.getAuthProvider() == null || user.getAuthProvider().equals("local")) {
                // Link existing local account with Google
                user.setAuthProvider("google");
                user.setProviderId(googleUserInfo.getSub());
            }
            user.setProfileImage(googleUserInfo.getPicture());
            user.setIsVerified(googleUserInfo.getEmailVerified());
            return userRepository.save(user);
        } else {
            // Create new user from Google account
            User newUser = new User();
            newUser.setEmail(googleUserInfo.getEmail());
            newUser.setPasswordHash(""); // Empty password for OAuth users (no password login)
            newUser.setFullName(googleUserInfo.getName());
            newUser.setProfileImage(googleUserInfo.getPicture());
            newUser.setAuthProvider("google");
            newUser.setProviderId(googleUserInfo.getSub());
            newUser.setIsVerified(googleUserInfo.getEmailVerified());
            newUser.setPhone(""); // Phone will be updated later by user
            
            return userRepository.save(newUser);
        }
    }

    /**
     * Exchange authorization code for access token and get user info
     * This is for OAuth2 Authorization Code Flow
     */
    public GoogleUserInfo exchangeCodeForUserInfo(String code) throws IOException {
        // Step 1: Exchange authorization code for access token
        String accessToken = exchangeCodeForAccessToken(code);
        
        // Step 2: Use access token to get user info
        return getUserInfoFromAccessToken(accessToken);
    }

    /**
     * Exchange authorization code for access token
     */
    private String exchangeCodeForAccessToken(String code) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri", redirectUri.replace("{baseUrl}", "http://localhost:8080"));
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(tokenUri, request, String.class);
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("access_token").asText();
        } catch (Exception e) {
            log.error("Error exchanging code for access token", e);
            throw new IOException("Failed to exchange authorization code: " + e.getMessage());
        }
    }

    /**
     * Get user info from Google using access token
     */
    private GoogleUserInfo getUserInfoFromAccessToken(String accessToken) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    userInfoUri,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            
            return GoogleUserInfo.builder()
                    .sub(jsonNode.get("sub").asText())
                    .email(jsonNode.get("email").asText())
                    .name(jsonNode.has("name") ? jsonNode.get("name").asText() : "")
                    .picture(jsonNode.has("picture") ? jsonNode.get("picture").asText() : "")
                    .emailVerified(jsonNode.has("email_verified") ? jsonNode.get("email_verified").asBoolean() : false)
                    .build();
        } catch (Exception e) {
            log.error("Error getting user info from access token", e);
            throw new IOException("Failed to get user info: " + e.getMessage());
        }
    }
}
