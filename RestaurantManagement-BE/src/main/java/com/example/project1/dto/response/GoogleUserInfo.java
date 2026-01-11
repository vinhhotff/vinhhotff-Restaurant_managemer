package com.example.project1.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleUserInfo {
    private String sub; // Google user ID
    private String email;
    private String name;
    private String picture;
    private Boolean emailVerified;
}
