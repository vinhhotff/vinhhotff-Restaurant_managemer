# Tài liệu Luồng Xác thực (Auth) và Người dùng (User)

Tài liệu này giải thích việc triển khai hiện tại của quản lý Xác thực và Người dùng trong dự án.

## Tổng quan Kiến trúc

Ứng dụng tuân theo kiến trúc phân lớp tiêu chuẩn:
- **Controller Layer (Tầng Điều khiển)**: Xử lý các yêu cầu HTTP, xác thực dữ liệu (`@Valid`), và gọi các service. Trả về `ApiResponse`.
- **Service Layer (Tầng Dịch vụ)**: Chứa logic nghiệp vụ (`AuthService`, `UserService`, `RefreshTokenService`).
- **Repository Layer (Tầng Truy xuất Dữ liệu)**: Truy cập cơ sở dữ liệu (`UserRepository`, `RefreshTokenRepository`).
- **Security Layer (Tầng Bảo mật)**: Xử lý xác thực JWT và ngữ cảnh xác thực (`JwtAuthenticationFilter`, `SecurityConfig`).

---

## 1. Luồng Xác thực (Authentication Flow)

Hệ thống xác thực sử dụng **JWT (JSON Web Token)** để kiểm soát truy cập và **Refresh Tokens** để duy trì phiên làm việc.

### A. Luồng Đăng nhập (`POST /auth/login`)
1.  **Yêu cầu (Request)**: Người dùng gửi `email` và `password`.
2.  **Xác thực (Validation)**: DTO `LoginRequest` kiểm tra định dạng dữ liệu.
3.  **Xác thực (Authentication)**:
    -   `AuthService` tìm người dùng theo email.
    -   Xác minh mã hóa mật khẩu (sử dụng `BCrypt`).
4.  **Tạo Token (Token Generation)**:
    -   **Access Token**: Được tạo qua `JwtUtil` (có hiệu lực trong 24 giờ). Chứa `email` (subject).
    -   **Refresh Token**: Được tạo qua `RefreshTokenService`. Một UUID ngẫu nhiên được tạo, băm (hashed) và lưu trong cơ sở dữ liệu (bảng `refresh_tokens`) với thời hạn (7 ngày).
5.  **Phản hồi (Response)**: Trả về cả hai token trong `AuthResponse`.

### B. Truy cập Tài nguyên được Bảo vệ
1.  **Yêu cầu**: Client gửi header `Authorization: Bearer <access_token>`.
2.  **Chặn (Interception)**: `JwtAuthenticationFilter` chặn yêu cầu.
3.  **Xác thực**:
    -   `JwtUtil` kiểm tra chữ ký và hạn sử dụng.
    -   `CustomUserDetailsService` tải thông tin người dùng từ DB.
4.  **Ngữ cảnh (Context)**: Nếu hợp lệ, `UsernamePasswordAuthenticationToken` được thiết lập trong `SecurityContextHolder`.
5.  **Thất bại**: Nếu không hợp lệ/hết hạn, `JwtAuthenticationEntryPoint` hoặc `GlobalExceptionHandler` trả về lỗi 401 Unauthorized.

### C. Luồng Refresh Token (`POST /auth/refresh`)
1.  **Yêu cầu**: Client gửi `refreshToken` khi Access Token hết hạn (401).
2.  **Kiểm tra (Validation)**: `RefreshTokenService` kiểm tra:
    -   Token có tồn tại trong DB không?
    -   Có bị thu hồi (revoked) không?
    -   Có hết hạn không?
3.  **Xoay vòng (Bảo mật Tốt nhất)**:
    -   Refresh token **cũ** được đánh dấu là `revoked` (đã thu hồi).
    -   Một refresh token **mới** được tạo ra.
    -   Một access token **mới** được tạo ra.
4.  **Phản hồi**: Trả về bộ token mới.

### D. Đăng xuất (`POST /auth/logout`)
1.  **Yêu cầu**: Client gửi `refreshToken`.
2.  **Hành động**: `RefreshTokenService` đánh dấu token là `revoked`.
3.  **Kết quả**: Refresh token không còn sử dụng được nữa. Access token vẫn hợp lệ cho đến khi hết hạn (thời gian sống ngắn).

---

## 2. Luồng Quản lý Người dùng (User Management Flow)

### A. Data Transfer Objects (DTOs)
-   **Requests**: `CreateUserRequest`, `UpdateUserRequest`. Sử dụng `@NotBlank`, `@Email` để xác thực.
-   **Response**: `UserResponse`. Ẩn dữ liệu nhạy cảm (mật khẩu băm).
-   **Wrapper**: `ApiResponse<T>`. Chuẩn hóa đầu ra JSON:
    ```json
    {
      "status": 200,
      "message": "Thành công",
      "data": { ... },
      "timestamp": "..."
    }
    ```

### B. Các thao tác CRUD
-   **Tạo (Create)**: Băm mật khẩu trước khi lưu. Kiểm tra tùy chọn thông báo mặc định.
-   **Đọc (Read)**: `findById` / `findAll` tiêu chuẩn.
-   **Cập nhật (Update)**: Logic `Patch` cho phép cập nhật từng phần.
-   **Xóa (Delete)**: **Xóa mềm (Soft Delete)**. Đặt dấu thời gian `deleted_at`. Hibernate `@Where(clause = "deleted_at IS NULL")` đảm bảo người dùng đã xóa bị bỏ qua trong các truy vấn một cách tự động.

---

## 3. Xử lý Lỗi (Error Handling)

`GlobalExceptionHandler` bắt các ngoại lệ và đảm bảo API luôn trả về JSON.

-   **Lỗi Xác thực (Validation Errors)**: Trả về 400 Bad Request với chi tiết từng trường.
-   **Lỗi Bảo mật (Security Errors)**: Trả về 401 Unauthorized (Token hết hạn, Sai thông tin đăng nhập).
-   **Lỗi Logic**: Trả về mã phù hợp (ví dụ: 409 Conflict cho email trùng lặp).
