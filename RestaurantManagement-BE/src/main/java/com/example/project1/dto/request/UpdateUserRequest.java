package com.example.project1.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserRequest {
    private String email;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private String profileImage;
}
