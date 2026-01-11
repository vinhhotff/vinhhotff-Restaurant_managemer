package com.example.project1.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleTokenRequest {
    
    @NotBlank(message = "ID token is required")
    private String idToken;
}
