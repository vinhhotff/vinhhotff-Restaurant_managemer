package com.example.project1.dto.request;

import lombok.Data;

import javax.validation.constraints.Email;
import java.time.LocalDate;

@Data
public class UpdateUserRequest {

    @Email(message = "Email must be valid")
    private String email;

    private String fullName;

    private String phone;

    private LocalDate dateOfBirth;

    private String profileImage;
}
