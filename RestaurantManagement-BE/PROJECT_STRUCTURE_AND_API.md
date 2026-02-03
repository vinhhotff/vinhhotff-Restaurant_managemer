# Cấu trúc dự án Restaurant Management (Spring Boot + PostgreSQL)

**Lưu ý:** Dự án dùng package **`com.example.project1.Models`** (không có thư mục `Entity`). Các class trong `Models` được ánh xạ thành bảng PostgreSQL.

---

## 1. Các bảng (Tables) và trường dữ liệu

### 1.1 Bảng `users`
| Cột (Column) | Kiểu | Ghi chú |
|--------------|------|--------|
| user_id | BIGSERIAL (PK) | |
| role_id | INTEGER (FK → roles) | |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password_hash | VARCHAR | Nullable (OAuth) |
| full_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | |
| auth_provider | VARCHAR(50) | "local", "google" |
| provider_id | VARCHAR(255) | |
| date_of_birth | DATE | |
| profile_image | VARCHAR(500) | |
| created_at | TIMESTAMP | NOT NULL |
| is_verified | BOOLEAN | default false |
| notification_preferences | JSONB | |
| deleted_at | TIMESTAMP | Soft delete |

### 1.2 Bảng `roles`
| Cột | Kiểu | Ghi chú |
|-----|------|--------|
| role_id | SERIAL (PK) | |
| name | VARCHAR(50) | UNIQUE, e.g. ROLE_USER, ROLE_OWNER, ROLE_ADMIN |

### 1.3 Bảng `role_permissions` (ManyToMany)
| Cột | Kiểu |
|-----|------|
| role_id | FK → roles |
| permission_id | FK → permissions |

### 1.4 Bảng `permissions`
| Cột | Kiểu |
|-----|------|
| permission_id | SERIAL (PK) |
| name | VARCHAR(100) UNIQUE |
| description | TEXT |

### 1.5 Bảng `refresh_tokens`
| Cột | Kiểu |
|-----|------|
| id | BIGSERIAL (PK) |
| token_id | VARCHAR UNIQUE |
| token_hash | VARCHAR |
| user_id | FK → users |
| expiry_date | TIMESTAMP |
| revoked | BOOLEAN |
| revoked_at | TIMESTAMP |

### 1.6 Bảng `reservations`
| Cột | Kiểu | Ghi chú |
|-----|------|--------|
| reservation_id | BIGSERIAL (PK) | |
| status | reservation_status (enum) | pending, confirmed, checked_in, cancelled, no_show, completed |
| occasion | occasion_type (enum) | birthday, anniversary, business, date, other |
| reservation_code | VARCHAR(20) | NOT NULL |
| user_id | BIGINT (FK → users) | NOT NULL |
| restaurant_id | INTEGER (FK → restaurants) | NOT NULL |
| table_id | INTEGER (FK → tables) | NOT NULL |
| reservation_date | DATE | NOT NULL |
| start_time | TIME | NOT NULL |
| end_time | TIME | NOT NULL |
| number_of_guests | INTEGER | NOT NULL |
| special_requests | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| cancellation_reason | TEXT | |
| check_in_at | TIMESTAMP | |
| no_show | BOOLEAN | default false |
| expired_at | TIMESTAMP | |
| deleted_at | TIMESTAMP | Soft delete |

### 1.7 Bảng `tables`
| Cột | Kiểu | Ghi chú |
|-----|------|--------|
| table_id | SERIAL (PK) | |
| status | table_status (enum) | available, occupied, reserved, maintenance |
| restaurant_id | INTEGER (FK → restaurants) | NOT NULL |
| area_id | INTEGER (FK → restaurant_areas) | |
| table_number | VARCHAR(50) | NOT NULL |
| table_name | VARCHAR(100) | |
| capacity | INTEGER | NOT NULL |
| min_persons | INTEGER | default 1 |
| position_description | TEXT | |
| features | JSONB | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| deleted_at | TIMESTAMP | Soft delete |

### 1.8 Bảng `cart_items`
| Cột | Kiểu |
|-----|------|
| cart_item_id | SERIAL (PK) |
| user_id | BIGINT (FK → users) NOT NULL |
| restaurant_id | INTEGER (FK → restaurants) NOT NULL |
| menu_id | INTEGER (FK → menus) NOT NULL |
| quantity | INTEGER NOT NULL (default 1) |
| special_instructions | TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### 1.9 Bảng `restaurants`
| Cột | Kiểu | Ghi chú |
|-----|------|--------|
| restaurant_id | SERIAL (PK) | |
| status | restaurant_status (enum) | pending, active, suspended |
| owner_id | FK → restaurant_owners | NOT NULL |
| name | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| address | TEXT | NOT NULL |
| city | VARCHAR(100) | NOT NULL |
| district | VARCHAR(100) | |
| ward | VARCHAR(100) | |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| phone | VARCHAR(20) | |
| email | VARCHAR(100) | |
| website | VARCHAR(200) | |
| opening_hours | JSONB | |
| price_range | VARCHAR(20) | |
| rating | DECIMAL(3,2) | default 0 |
| total_reviews | INTEGER | default 0 |
| cover_image | VARCHAR(500) | |
| gallery | JSONB | |
| features | JSONB | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| deleted_at | TIMESTAMP | Soft delete |

### 1.10 Bảng `restaurant_areas`
| Cột | Kiểu |
|-----|------|
| area_id | SERIAL (PK) |
| restaurant_id | INTEGER (FK) NOT NULL |
| name | VARCHAR(100) NOT NULL |
| description | TEXT |
| capacity | INTEGER |
| smoking_allowed | BOOLEAN default false |
| outdoor | BOOLEAN default false |
| status | VARCHAR(20) |

### 1.11 Bảng `menus`
| Cột | Kiểu |
|-----|------|
| menu_id | SERIAL (PK) |
| restaurant_id | INTEGER (FK) NOT NULL |
| name | VARCHAR(200) NOT NULL |
| description | TEXT |
| price | DECIMAL(10,2) NOT NULL |
| currency | VARCHAR(3) default 'VND' |
| image_url | VARCHAR(500) |
| is_available | BOOLEAN default true |
| created_at | TIMESTAMP |
| deleted_at | TIMESTAMP |

### 1.12 Bảng `payments`
| Cột | Kiểu |
|-----|------|
| payment_id | SERIAL (PK) |
| reservation_id | BIGINT (FK → reservations) NOT NULL |
| payment_method | VARCHAR (enum) |
| payment_status | VARCHAR (enum) default PENDING |
| amount | DECIMAL(10,2) NOT NULL |
| currency | VARCHAR(3) default 'VND' |
| paid_at | TIMESTAMP |
| refund_at | TIMESTAMP |
| transaction_id | VARCHAR(100) |
| transaction_ref | VARCHAR(255) |
| created_at | TIMESTAMP |

### 1.13 Các bảng khác (có Entity nhưng chưa có API REST)
- **audit_logs** – Nhật ký kiểm toán  
- **categories** – Danh mục (name, icon, parent_id)  
- **favorites** – Yêu thích (user, restaurant)  
- **login_history** – Lịch sử đăng nhập  
- **menu_stats** – Thống kê menu  
- **notifications** – Thông báo  
- **notification_templates** – Mẫu thông báo  
- **pre_orders** – Đặt món trước (reservation_id, menu_id, quantity)  
- **promotions** – Khuyến mãi  
- **restaurant_categories** – Phân loại nhà hàng  
- **restaurant_owners** – Chủ nhà hàng  
- **restaurant_settings** – Cài đặt nhà hàng  
- **restaurant_stats** – Thống kê nhà hàng  
- **reviews** – Đánh giá  
- **review_replies** – Trả lời đánh giá  

---

## 2. Danh sách API (Endpoints) chính

### 2.1 Auth (`/auth`)
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | /auth/register | Đăng ký tài khoản |
| POST | /auth/login | Đăng nhập |
| POST | /auth/refresh | Làm mới access token (cookie refreshToken) |
| POST | /auth/logout | Đăng xuất |
| GET | /auth/google/login | Chuyển hướng đăng nhập Google |
| GET | /auth/google/callback | Callback sau khi Google xác thực |

### 2.2 Users (`/api/users`)
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /api/users | Danh sách user (phân trang: page, size, sort) |
| GET | /api/users/{id} | Chi tiết user |
| GET | /api/users/{id}/reservations | Danh sách đặt bàn của user |
| POST | /api/users | Tạo user |
| PATCH | /api/users/{id} | Cập nhật user |
| DELETE | /api/users/{id} | Xóa mềm user |

### 2.3 Reservations (`/api/reservations`)
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /api/reservations | Danh sách đặt bàn |
| GET | /api/reservations/{id} | Chi tiết đặt bàn |
| POST | /api/reservations | Tạo đặt bàn |
| PUT | /api/reservations/{id} | Cập nhật đặt bàn |
| DELETE | /api/reservations/{id} | Xóa đặt bàn |

### 2.4 Tables (`/api/tables`)
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /api/tables | Danh sách bàn |
| GET | /api/tables/{name} | Lấy bàn theo tên (name) |
| POST | /api/tables | Tạo bàn |
| PUT | /api/tables/{id} | Cập nhật bàn |
| DELETE | /api/tables/{id} | Xóa bàn |

### 2.5 Cart Items (`/api/cartItems`)
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /api/cartItems | Danh sách item trong giỏ |
| POST | /api/cartItems | Thêm item vào giỏ |
| PUT | /api/cartItems/{id} | Cập nhật item (số lượng, ghi chú) |
| DELETE | /api/cartItems/{id} | Xóa item khỏi giỏ |

**Lưu ý:** Các route `/api/*` và `/api/cartItems` yêu cầu xác thực JWT (trừ `/auth/**`).

---

## 3. Tóm tắt logic nghiệp vụ – Restaurant Management

- **Đặt bàn (Reservation):** Khách (User) chọn nhà hàng, bàn (Tables), ngày/giờ, số khách, dịp (occasion). Hệ thống lưu đặt bàn với trạng thái (pending → confirmed → checked_in / completed / cancelled / no_show). Có hỗ trợ check-in, no-show, hủy (có lý do).

- **Quản lý bàn (Tables):** Mỗi bàn thuộc một nhà hàng và có thể thuộc khu vực (RestaurantArea). Bàn có trạng thái: available, occupied, reserved, maintenance. Có capacity, min_persons, mô tả vị trí, features (JSONB). Dùng cho đặt bàn và quản lý chỗ ngồi.

- **Giỏ hàng / Đặt món (Cart Items):** User thêm món (Menu) của nhà hàng vào giỏ với số lượng và ghi chú. Cart gắn với user + restaurant + menu. Có thể cập nhật/xóa item. Liên quan đến đặt món trước (PreOrder) và sau này có thể gắn với Reservation/thanh toán.

- **Thanh toán (Payment):** Entity Payment gắn với Reservation: phương thức thanh toán, trạng thái (PENDING, …), số tiền, thời gian thanh toán/hoàn tiền, transaction id/ref. Hiện backend chưa expose REST API cho Payment; logic thanh toán có thể mở rộng sau.

- **Người dùng & phân quyền:** User có Role (và Role có Permissions). Đăng ký/đăng nhập local hoặc Google OAuth. JWT + RefreshToken cho phiên đăng nhập. User có thể xem/sửa profile, admin quản lý user (CRUD, xóa mềm).

- **Nhà hàng & Thực đơn:** Restaurant (thông tin địa chỉ, giờ mở cửa, đánh giá, …), Menu (món, giá, thuộc nhà hàng). Dùng cho đặt bàn (chọn nhà hàng/bàn) và giỏ hàng (chọn món). Các bảng PreOrder, Promotion, Review hỗ trợ đặt món trước, khuyến mãi và đánh giá.

---

## 4. JSON mẫu – Đối tượng chính (Reservation)

```json
{
  "id": 1,
  "reservationCode": "RES-2026-0001",
  "status": "confirmed",
  "occasion": "birthday",
  "userId": 10,
  "userFullName": "Nguyễn Văn A",
  "restaurantId": 1,
  "restaurantName": "Nhà hàng ABC",
  "tableId": 5,
  "tableName": "Bàn 12 - VIP",
  "reservationDate": "2026-02-15",
  "startTime": "18:00",
  "endTime": "20:00",
  "numberOfGuests": 4,
  "specialRequests": "Bàn góc, có bánh sinh nhật",
  "createdAt": "2026-02-03T10:00:00Z",
  "updatedAt": "2026-02-03T10:05:00Z",
  "checkInAt": null,
  "noShow": false,
  "cancellationReason": null
}
```

**Giải thích nhanh:** Đây là dạng response đặt bàn: mã, trạng thái, dịp, thông tin user, nhà hàng, bàn, ngày/giờ, số khách, ghi chú, thời gian tạo/cập nhật và các trường check-in/hủy/no-show.

---

*Tài liệu được tạo từ quét `com.example.project1.Models` và `com.example.project1.Controller`.*
