# System Architecture & Design Patterns

Tài liệu này giải thích các lựa chọn kỹ thuật và các mẫu thiết kế (Design Patterns) được áp dụng trong dự án để đảm bảo tính chuyên nghiệp và khả năng bảo trì lâu dài.

## 1. Mẫu thiết kế Service - Implementation (Interface-driven Design)

Dự án áp dụng chặt chẽ nguyên lý **Dependency Inversion** trong bộ SOLID.
- **Lợi ích**: Giúp code linh hoạt, dễ dàng thay thế implementation mà không ảnh hưởng tới Controller. Hỗ trợ Unit Test hiệu quả.
- **Cấu trúc**:
    - `ITableService.java` (Interface định nghĩa hợp đồng)
    - `TableService.java` (Implementation thực hiện logic)

## 2. DTO & Mapper Pattern (MapStruct)

Chúng ta không bao giờ trả trực tiếp **Entity** (đối tượng CSDL) cho người dùng để tránh rò rỉ thông tin (như password, deletedAt).
- **DTO (Data Transfer Object)**: Tách biệt dữ liệu đầu vào (`Request`) và đầu ra (`Response`).
- **MapStruct**: Sử dụng thư viện compile-time để tự động hóa việc ánh xạ dữ liệu. Điều này chuyên nghiệp và nhanh hơn nhiều so với việc dùng `BeanUtils` hay setter thủ công.

## 3. Quản lý lỗi tập trung (Global Exception Handling)

Thay vì dùng `try-catch` tràn lan trong code, hệ thống sử dụng một bộ xử lý lỗi duy nhất:
- **AppException**: Một custom exception chuyên dụng mang theo HTTP Status Code.
- **GlobalExceptionHandler**: Sử dụng `@RestControllerAdvice` để bắt các lỗi và trả về một cấu trúc JSON đồng nhất (`ApiResponse`).

## 4. Quản lý truy vấn động (JPA Specification)

Để xử lý các bộ lọc tìm kiếm phức tạp (ví dụ: tìm user theo tên, email, đã verify hay chưa cùng lúc), dự án sử dụng **Criteria API** thông qua `Specification`. 
- Giúp tránh việc tạo quá nhiều method tìm kiếm cứng nhắc trong Repository.
- Code linh hoạt và có khả năng mở rộng bộ lọc dễ dàng.

## 5. Security & JWT

Hệ thống bảo mật Stateless:
- **JWT**: Sử dụng Token để xác thực người dùng trên mỗi request.
- **Stateless**: Server không lưu session, giúp hệ thống dễ dàng mở rộng (Scale-out).
