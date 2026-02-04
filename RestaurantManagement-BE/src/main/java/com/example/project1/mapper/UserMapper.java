package com.example.project1.mapper;

import com.example.project1.Models.User;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.dto.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "authProvider", ignore = true)
    @Mapping(target = "providerId", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    @Mapping(target = "profileImage", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "notificationPreferences", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    User toEntity(CreateUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "authProvider", ignore = true)
    @Mapping(target = "providerId", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "notificationPreferences", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(@MappingTarget User user, UpdateUserRequest request);

    UserResponse toResponse(User user);
}
