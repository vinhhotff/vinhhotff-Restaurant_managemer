package com.example.project1.Controller;

import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.dto.response.ApiResponse;
import com.example.project1.dto.response.ReservationResponse;
import com.example.project1.dto.response.UserResponse;
import com.example.project1.Models.User;
import com.example.project1.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users
     * Lấy danh sách users có phân trang và sắp xếp.
     * Ví dụ: /api/users?page=0&size=10&sort=fullName,asc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<UserResponse> users = userService.getAllUsers(pageable);

        return ResponseEntity.ok(
                ApiResponse.success(users, "Get all users successfully"));
    }

    /**
     * GET /api/users/{id}/reservations
     * Lấy danh sách đặt chỗ của một user cụ thể.
     */
    @GetMapping("/{id}/reservations")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getUserReservations(@PathVariable Long id) {
        List<ReservationResponse> reservations = userService.getUserReservations(id);

        return ResponseEntity.ok(
                ApiResponse.success(reservations, "Get user reservations successfully"));
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);

        return ResponseEntity.ok(
                ApiResponse.success(UserResponse.from(user), "User found"));
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
                ApiResponse.success(null, "User deleted successfully"));
    }

    // UPDATE USER
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {

        User updatedUser = userService.updateUser(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(UserResponse.from(updatedUser), "User updated successfully"));
    }

}
