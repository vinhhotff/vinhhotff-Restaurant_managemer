# Kế hoạch triển khai Frontend – Restaurant Management

Tài liệu này dựa trên logic **RestaurantManagement-BE** (Spring Boot, JWT + Cookie, REST API) để lên kế hoạch code frontend (Next.js, TypeScript) một cách có hệ thống.

---

## 1. Tổng quan Backend (đã đọc)

### 1.1 Kiến trúc API

- **Chuẩn response**: Mọi endpoint trả về `ApiResponse<T>`:
  - `status`, `message`, `data`, `error?`, `timestamp`, `traceId`
- **Xác thực**: JWT qua **Cookie** (`accessToken`, `refreshToken`) hoặc header `Authorization: Bearer <token>`.
- **CORS**: Cho phép `http://localhost:3000`, `credentials: true`.
- **Public**: Chỉ `/auth/**`, `/oauth2/**`, `/login/oauth2/**`, `/api/public/**`. Còn lại **bắt buộc đăng nhập**.

### 1.2 Các nhóm API

| Nhóm        | Base path           | Mô tả ngắn                          |
|------------|---------------------|-------------------------------------|
| Auth       | `/auth`             | Đăng ký, đăng nhập, refresh, logout, Google OAuth |
| Users      | `/api/users`       | CRUD user, phân trang, reservations của user |
| Reservations | `/api/reservations` | CRUD đặt bàn                        |
| Tables     | `/api/tables`      | CRUD bàn (get by name = path `/{name}`) |
| CartItems  | `api/cartItems`    | CRUD giỏ hàng (không có `/` đầu)   |

---

## 2. Chi tiết API cần tích hợp Frontend

### 2.1 Auth (`/auth`)

| Method | Path               | Body / Cookie              | Ghi chú |
|--------|--------------------|----------------------------|--------|
| POST   | `/auth/register`   | `CreateUserRequest`        | Trả về Set-Cookie (accessToken, refreshToken) |
| POST   | `/auth/login`      | `LoginRequest`             | Set-Cookie |
| POST   | `/auth/refresh`    | Cookie: `refreshToken`     | Trả về Set-Cookie mới |
| POST   | `/auth/logout`     | Cookie: `refreshToken`     | Xóa cookie |
| GET    | `/auth/google/login` | -                       | Redirect đến Google (mở tab/iframe hoặc window) |
| GET    | `/auth/google/callback` | Query: `code`          | Backend xử lý, set cookie; FE nhận redirect về URL đã cấu hình |

**DTO tham chiếu:**

- **LoginRequest**: `email`, `password`
- **CreateUserRequest**: `email`, `password`, `fullName`, `phone`

**Frontend hiện tại:** Đã có form login/register, gọi đúng endpoint, dùng `api` với `withCredentials: true` → đúng hướng. Cần bổ sung: xử lý refresh token khi 401, tích hợp Google login (link/redirect), trang success sau OAuth.

---

### 2.2 Users (`/api/users`)

| Method | Path                        | Body / Query              | Response (trong `data`)      |
|--------|-----------------------------|---------------------------|------------------------------|
| GET    | `/api/users`                | `page`, `size`, `sort`    | `Page<UserResponse>`         |
| GET    | `/api/users/{id}`           | -                         | `UserResponse`               |
| GET    | `/api/users/{id}/reservations` | -                     | `List<ReservationResponse>`  |
| POST   | `/api/users`                | `CreateUserRequest`       | `User`                       |
| PATCH  | `/api/users/{id}`           | `UpdateUserRequest`       | `UserResponse`               |
| DELETE | `/api/users/{id}`           | -                         | -                            |

**DTO:**

- **UserResponse**: `id`, `email`, `fullName`, `phone`, `isVerified`
- **UpdateUserRequest**: `email?`, `fullName?`, `phone?`, `dateOfBirth?`, `profileImage?`

**Frontend cần:** Trang quản lý user (admin): danh sách có phân trang, tạo/sửa/xóa; trang profile: xem/sửa thông tin cá nhân; trang “reservations của tôi” có thể dùng `GET /api/users/{id}/reservations`.

---

### 2.3 Reservations (`/api/reservations`)

| Method | Path                       | Body           | Response (trong `data`)   |
|--------|----------------------------|----------------|---------------------------|
| GET    | `/api/reservations`        | -              | `List<ReservationResponse>` |
| GET    | `/api/reservations/{id}`   | -              | `ReservationResponse`     |
| POST   | `/api/reservations`        | `ReservationDTO` | `ReservationResponse`   |
| PUT    | `/api/reservations/{id}`   | `ReservationDTO` | `ReservationResponse`   |
| DELETE | `/api/reservations/{id}`   | -              | -                         |

**ReservationDTO (request):**

- `reservationCode?`, `userId`, `restaurantId`, `tableId`, `reservationDate` (LocalDate, phải tương lai), `startTime`, `endTime` (LocalTime), `numberOfGuests` (min 1), `specialRequests?`, `occasion?` (enum: birthday, anniversary, business, date, other).

**ReservationResponse:**  
`id`, `reservationCode`, `userId`, `userFullName`, `restaurantId`, `restaurantName`, `tableId`, `tableName`, `reservationDate`, `startTime`, `endTime`, `numberOfGuests`, `specialRequests`, `createdAt`, `updatedAt`.

**Frontend cần:** Trang danh sách đặt bàn (đã có skeleton trên dashboard), trang tạo/sửa đặt bàn (form với restaurant, bàn, ngày, giờ, số khách, occasion, ghi chú). Cần nguồn dữ liệu: restaurants, tables (gọi `/api/tables` hoặc theo restaurant nếu sau này BE bổ sung filter).

---

### 2.4 Tables (`/api/tables`)

| Method | Path                 | Body           | Response (trong `data`) |
|--------|----------------------|----------------|--------------------------|
| GET    | `/api/tables`        | -              | `List<TableResponse>`    |
| GET    | `/api/tables/{name}` | -              | `TableResponse` (theo tên) |
| POST   | `/api/tables`        | `TableRequest` | `TableResponse`          |
| PUT    | `/api/tables/{id}`   | `TableRequest` | `TableResponse`          |
| DELETE | `/api/tables/{id}`   | -              | -                        |

**TableRequest:**  
`restaurantId`, `areaId`, `tableNumber`, `tableName`, `capacity` (min 1), `minPersons?`, `positionDescription?`, `status?`, `features?` (Map).

**TableResponse:**  
`id`, `restaurantId`, `areaId`, `areaName`, `tableNumber`, `tableName`, `capacity`, `minPersons`, `positionDescription`, `status`, `features`, `createdAt`, `updatedAt`.

**Frontend cần:** Trang quản lý bàn: danh sách, thêm/sửa/xóa. Form tạo/sửa đặt bàn cần dropdown “Chọn bàn” (từ GET `/api/tables` hoặc theo restaurant khi có API filter).

---

### 2.5 CartItems (`api/cartItems`)

**Lưu ý:** Controller mapping là `api/cartItems` (không có `/` đầu). Nếu `baseURL = http://localhost:8080` thì gọi đầy đủ là `http://localhost:8080/api/cartItems` → cần thống nhất base (ví dụ `http://localhost:8080` và path đủ `/api/cartItems`).

| Method | Path                   | Body              | Response (trong `data`) |
|--------|------------------------|-------------------|--------------------------|
| GET    | `/api/cartItems`       | -                 | `List<CartItemResponse>` |
| POST   | `/api/cartItems`       | `CartItemRequest` | `CartItemResponse`       |
| PUT    | `/api/cartItems/{id}`  | `CartItemRequest` | `CartItemResponse`       |
| DELETE | `/api/cartItems/{id}`  | -                 | -                        |

**CartItemRequest:**  
`userId`, `restaurantId`, `menuId`, `quantity`, `specialInstructions?`.

**CartItemResponse:**  
`userId`, `restaurantId`, `menuId`, `quantity`, `specialInstructions`, `updatedAt`. (Thiếu `id` trong response – nếu BE bổ sung `id` thì dùng cho PUT/DELETE.)

**Frontend cần:** Giỏ hàng: thêm/sửa số lượng/xóa item; cần biết `menuId` (từ menu nhà hàng – hiện BE chưa expose API menu, có thể mock hoặc chờ BE).

---

## 3. Kế hoạch thực hiện Frontend (theo giai đoạn)

### Phase 1: Nền tảng Auth & API (ưu tiên cao)

1. **Cấu hình môi trường**
   - Đảm bảo `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` (hoặc URL BE thực tế).
   - Axios: `baseURL` = biến trên, `withCredentials: true` (đã có).

2. **Chuẩn hóa ApiResponse và interceptors**
   - Tạo type `ApiResponse<T>` (status, message, data, error?, timestamp, traceId).
   - Axios response interceptor: trả về `response.data` (cả object ApiResponse) để component dùng thống nhất; hoặc unwrap `data` tùy convention.
   - Axios request interceptor: khi response 401, gọi `POST /auth/refresh` (cookie đã gửi kèm), nếu thành công retry request gốc; nếu refresh fail → redirect về `/login` và xóa state auth.

3. **Auth context / store**
   - Lưu user (id, email, fullName, …) sau login/register/refresh; có thể gọi thêm `GET /api/users/me` nếu BE bổ sung, hoặc decode JWT (chỉ để hiển thị, không thay thế việc validate ở BE).
   - Logout: gọi `POST /auth/logout` + clear state + redirect login.

4. **Google OAuth**
   - Nút “Đăng nhập bằng Google”: mở `GET /auth/google/login` (cùng origin hoặc redirect đến BE, BE redirect đến Google).
   - Sau khi đăng nhập Google xong, BE redirect về URL đã cấu hình (ví dụ `http://localhost:3000/auth/success`). Trang `/auth/success`: đọc query/hash hoặc cookie (nếu BE set cookie rồi redirect), cập nhật auth state và redirect vào dashboard.

5. **Protected routes & layout**
   - Component/HOC hoặc middleware: nếu chưa đăng nhập → redirect `/login`; nếu đã login thì cho vào (dashboard, users, reservations, tables, cart).
   - Layout chung: header (logo, nav: Dashboard, Reservations, Tables, Users, Cart), user menu (profile, logout).

---

### Phase 2: Users (quản lý user & profile)

6. **Trang profile (user hiện tại)**
   - GET `/api/users/{id}` (id từ auth context).
   - Form chỉnh sửa: PATCH `/api/users/{id}` với `UpdateUserRequest` (fullName, phone, email, dateOfBirth, profileImage nếu có).

7. **Trang quản lý user (admin)**
   - GET `/api/users?page=&size=&sort=` → bảng có phân trang, sort.
   - Nút thêm user: form `CreateUserRequest` → POST `/api/users`.
   - Sửa: PATCH `/api/users/{id}`; Xóa: DELETE (soft delete).
   - (Tùy chọn) Tab “Đặt bàn của user”: GET `/api/users/{id}/reservations`.

---

### Phase 3: Reservations (đặt bàn)

8. **Danh sách đặt bàn**
   - GET `/api/reservations` → bảng/card: mã, ngày, giờ, bàn, nhà hàng, số khách, trạng thái (nếu BE bổ sung trong response).
   - Filter theo ngày/restaurant (client-side hoặc chờ BE hỗ trợ query).

9. **Tạo / sửa đặt bàn**
   - Form: chọn restaurant (id), bàn (từ GET `/api/tables`, lọc theo restaurantId nếu có), ngày, startTime, endTime, numberOfGuests, occasion, specialRequests; userId lấy từ auth.
   - POST `/api/reservations` hoặc PUT `/api/reservations/{id}`.
   - Validate: ngày phải trong tương lai, số khách ≥ 1.

10. **Chi tiết & xóa**
    - GET `/api/reservations/{id}` cho trang chi tiết.
    - DELETE `/api/reservations/{id}` với xác nhận.

---

### Phase 4: Tables (quản lý bàn)

11. **Danh sách bàn**
    - GET `/api/tables` → bảng: id, tên, khu vực, capacity, status, …
    - Filter theo restaurant/area (client-side hoặc API sau này).

12. **Tạo / sửa / xóa bàn**
    - Form `TableRequest`: restaurantId, areaId, tableNumber, tableName, capacity, minPersons, positionDescription, status, features.
    - POST `/api/tables`, PUT `/api/tables/{id}`, DELETE `/api/tables/{id}`.

---

### Phase 5: Cart (giỏ hàng)

13. **Giỏ hàng**
    - GET `/api/cartItems` → danh sách item (cần mapping menuId → tên món nếu có API menu).
    - Thêm: POST `/api/cartItems` (userId, restaurantId, menuId, quantity, specialInstructions).
    - Sửa số lượng: PUT `/api/cartItems/{id}`.
    - Xóa: DELETE `/api/cartItems/{id}`.
    - Lưu ý: CartItemResponse có thể thiếu `id`; nếu BE chưa trả về id, cần yêu cầu BE bổ sung để PUT/DELETE đúng item.

---

### Phase 6: Cải thiện UX & bảo mật

14. **Loading, lỗi, empty state**
    - Mỗi trang: skeleton/spinner khi loading; hiển thị message từ `ApiResponse.message` hoặc `error`; empty state khi danh sách rỗng.

15. **Form validation**
    - Dùng Zod (hoặc tương đương) khớp với BE: email, password min 6, fullName, phone, reservationDate future, numberOfGuests ≥ 1, v.v.

16. **Security**
    - Không lưu accessToken trong localStorage khi dùng cookie; chỉ lưu state user (không nhạy cảm).
    - Logout khi refresh token hết hạn (đã nêu ở Phase 1).

---

## 4. Cấu trúc thư mục Frontend gợi ý

```text
app/
  (auth)/
    login/page.tsx
    register/page.tsx
    auth/success/page.tsx    # Sau Google OAuth
  (protected)/
    layout.tsx              # Protected layout + nav
    dashboard/page.tsx
    profile/page.tsx
    users/
      page.tsx              # Danh sách user (admin)
      [id]/page.tsx         # Chi tiết / sửa user
    reservations/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    tables/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    cart/page.tsx
components/
  forms/
    auth-form.tsx
    user-form.tsx
    reservation-form.tsx
    table-form.tsx
    cart-item-form.tsx
  ui/                       # Button, Card, Input, Table, Modal...
lib/
  api.ts                    # Axios instance + interceptors
  types/
    api.ts                  # ApiResponse<T>
    auth.ts
    user.ts
    reservation.ts
    table.ts
    cart.ts
hooks/
  useAuth.ts
  useApi.ts
```

---

## 5. Thứ tự triển khai đề xuất (checklist)

- [ ] **Phase 1:** Cấu hình env, ApiResponse type, interceptors (refresh 401), auth context, Google OAuth flow, protected routes & layout.
- [ ] **Phase 2:** Profile (GET/PATCH user), trang admin users (list, create, update, delete).
- [ ] **Phase 3:** Reservations list, form tạo/sửa, chi tiết, xóa.
- [ ] **Phase 4:** Tables list, form tạo/sửa, xóa.
- [ ] **Phase 5:** Cart: list, add, update quantity, delete (đồng bộ với BE CartItemResponse có id nếu cần).
- [ ] **Phase 6:** Loading/error/empty, validation đồng bộ BE, kiểm tra bảo mật (cookie-only, logout khi hết session).

Sau khi hoàn thành từng phase, nên test E2E: đăng nhập → vào từng trang → CRUD tương ứng với từng API đã liệt kê ở trên.

---

*Tài liệu được tạo từ logic hiện tại của RestaurantManagement-BE; nếu BE thêm endpoint hoặc đổi DTO, cần cập nhật lại plan và types tương ứng.*
