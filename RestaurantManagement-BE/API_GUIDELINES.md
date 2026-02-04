# API Guidelines & Response Format

Tất cả các API trong hệ thống đều tuân thủ một quy chuẩn phản hồi đồng nhất để các ứng dụng Mobile/Web (Frontend) dễ dàng tích hợp.

## 1. Cấu trúc phản hồi (ApiResponse)

Mọi yêu cầu đều trả về đối tượng JSON có cấu trúc sau:

```json
{
  "code": 200,          // Mã HTTP (200, 201, 400, 404, 500...)
  "message": "Thành công", // Thông báo thân thiện cho người dùng
  "result": { ... }      // Dữ liệu thực tế (Object, List hoặc Page)
}
```

## 2. Phân trang (Pagination)

Đối với các danh sách dài (User, Restaurant, Table), hệ thống sử dụng Phân trang của Spring Data. Kết quả trả về trong `result` sẽ bao gồm các thông tin bổ trợ:
- `content`: Danh sách dữ liệu của trang hiện tại.
- `totalPages`: Tổng số trang.
- `totalElements`: Tổng số bản ghi.
- `size`: Số lượng mỗi trang.

## 3. Quy tắc đặt tên (Naming Convention)

- **URL**: Sử dụng kebab-case (ví dụ: `/api/restaurant-areas`).
- **Method**: Sử dụng đúng ý nghĩa RESTful:
    - `GET`: Lấy dữ liệu.
    - `POST`: Tạo mới.
    - `PUT`: Cập nhật toàn bộ.
    - `PATCH`: Cập nhật một phần (Partial update).
    - `DELETE`: Xóa (Thường là Soft Delete).

## 4. Bảo mật

Tất cả các API nhạy cảm (quản lý, đặt bàn, xem thông tin cá nhân) đều yêu cầu Header:
`Authorization: Bearer <JWT_TOKEN>`
