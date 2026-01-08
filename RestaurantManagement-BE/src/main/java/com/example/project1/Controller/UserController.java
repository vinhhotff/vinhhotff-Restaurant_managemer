package com.example.project1.Controller;

import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.UserResponse;
import com.example.project1.Models.User;
import com.example.project1.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET ALL USERS
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(UserResponse::from)
                .toList();

        return ResponseEntity.ok(
                ApiResponse.success(users, "Get all users successfully")
        );
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);

        return ResponseEntity.ok(
                ApiResponse.success(UserResponse.from(user), "User found")
        );
    }

    // CREATE USER
    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        ApiResponse<User> response = ApiResponse.success(user, "User created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    // DELETE USER (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
                ApiResponse.success(null, "User deleted successfully")
        );
    }

    //UPDATE USER
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {

        User updatedUser = userService.updateUser(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(UserResponse.from(updatedUser), "User updated successfully")
        );
    }

}
