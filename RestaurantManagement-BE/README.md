# Restaurant Management System (Backend)

Hệ thống quản lý nhà hàng thông minh (Dự án Đồ án) được xây dựng trên nền tảng **Spring Boot**, tập trung vào khả năng mở rộng, bảo mật và hiệu năng cao. Hệ thống hỗ trợ quản lý đa nhà hàng, đặt bàn trực tuyến, thực đơn điện tử và chương trình khách hàng thân thiết.

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Ngôn ngữ**: Java 17
- **Framework**: Spring Boot 2.7.x (Spring Data JPA, Spring Security, Spring Web)
- **Cơ sở dữ liệu**: PostgreSQL
- **Xử lý Mapping**: MapStruct (Chuyển đổi DTO - Entity chuyên nghiệp)
- **Tiện ích**: Lombok (Giảm boilerplate code)
- **Bảo mật**: JWT (JSON Web Token), OAuth2 (Google Login)
- **Quản lý phiên bản CSDL**: Hibernate Auto Generation

## ✨ Các tính năng chính (Key Features)

- **Quản lý Người dùng (User Management)**: Phân quyền Role-based, quản lý điểm thưởng (Loyalty Points).
- **Quản lý Nhà hàng (Restaurant Management)**: Quản lý thông tin, khu vực (Area), bàn (Table), thực đơn (Menu).
- **Hệ thống Đặt bàn (Reservation System)**: Quy trình đặt bàn thông minh, tích hợp gọi món trước (Pre-order).
- **Tích hợp OAuth2**: Đăng nhập nhanh chóng qua Google.
- **Lọc nâng cao (Advanced Filtering)**: Hỗ trợ tìm kiếm động bằng Specification (Keyword, Verify, Area...).

## 📂 Cấu trúc dự án (Project Structure)

```text
src/main/java/com/example/project1/
├── Controller/      # Lớp tiếp nhận Request và phản hồi (REST Endpoints)
├── Service/         # Lớp xử lý nghiệp vụ (Business Logic)
│   └── Ipm/         # Chứa Interfaces (Contract-first Design)
├── Repository/      # Lớp tương tác CSDL (Spring Data JPA)
│   └── Specification/ # Các truy vấn động (Dynamic Filtering)
├── Models/          # Các thực thể CSDL (JPA Entities)
├── dto/             # Đối tượng trao đổi dữ liệu (Request/Response)
├── mapper/          # MapStruct Interfaces (Logic chuyển đổi dữ liệu)
├── exception/       # Xử lý lỗi tập trung (Global Exception Handling)
└── Security/        # Cấu hình JWT, Security Filter, OAuth2
```

## 🛠 Hướng dẫn cài đặt (Installation)

1. **Yêu cầu**: Java 17+, PostgreSQL.
2. **Cấu hình CSDL**: Cập nhật thông tin trong file `src/main/resources/application.properties` hoặc file `.env`.
3. **Chạy ứng dụng**:
   ```bash
   ./mvnw spring-boot:run
   ```

## 📄 Tài liệu chi tiết
- [Kiến trúc hệ thống (Architecture)](ARCHITECTURE.md)
- [Quy chuẩn API (API Guidelines)](API_GUIDELINES.md)
