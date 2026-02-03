


Tuyệt vời! Tiếp tục đà này, chúng ta sẽ sang **Đợt 2**. Đợt này cực kỳ quan trọng vì nó tập trung vào nghiệp vụ cốt lõi của dự án: **Quản lý sơ đồ bàn và Quy trình đặt bàn**.

Dưới đây là Prompt cho 5 màn hình tiếp theo để bạn dán vào **Stitch**:

---

## Batch 2: Quản lý Sơ đồ Bàn & Đặt bàn (5 Màn hình)

### 6. Màn hình Sơ đồ Bàn (Table Layout Visualizer)

Đây là màn hình giúp nhân viên nhìn nhanh bàn nào trống, bàn nào đang có khách.
**Prompt cho Stitch:**

> Create a Visual Table Layout for a restaurant.
> * **Header:** Tabs for different areas based on `restaurant_areas` (e.g., Indoor, Outdoor, VIP).
> * **Main Grid:** Display tables as cards/circles.
> * **Table Status Colors:** Green (Available), Red (Occupied), Yellow (Reserved), Gray (Maintenance).
> * **Card Info:** Table Number, Capacity (e.g., "4 pax").
> * **Interactive:** Clicking a table opens a quick summary of the current reservation.
> 
> 

### 7. Màn hình Quản lý Danh sách Bàn (Tables CRUD)

Dùng để thêm/sửa/xóa thông tin kỹ thuật của bàn.
**Prompt cho Stitch:**

> Create a Table Management data grid based on the `tables` table schema.
> * **Columns:** Table Number, Area Name, Capacity, Min Persons, Status, Features (tags).
> * **Filter:** By Status and Area.
> * **Add New Table Form:** A modal with inputs for `table_number`, `capacity`, and a textarea for `position_description`.
> * **Style:** Professional, easy to scan large amounts of data.
> 
> 

### 8. Màn hình Tạo Đặt bàn (New Reservation Form)

Đây là form quan trọng nhất dành cho khách hàng hoặc nhân viên lễ tân.
**Prompt cho Stitch:**

> Create a "Book a Table" multi-step form.
> * **Step 1:** Select Date, Time (`start_time`), and Number of Guests.
> * **Step 2:** Select Table (Filtering only 'Available' tables from the `tables` list).
> * **Step 3:** Guest Info (Full Name, Phone, Email) and Occasion (Dropdown: Birthday, Anniversary, Business, etc.).
> * **Step 4:** Special Requests (Textarea) and Confirmation.
> * **UI:** Stepper component at the top to track progress.
> 
> 

### 9. Màn hình Danh sách Đặt bàn (Reservations List)

Nơi quản lý tất cả các đơn đặt bàn từ cũ đến mới.
**Prompt cho Stitch:**

> Create a Comprehensive Reservations Table based on the `reservations` schema.
> * **Columns:** Reservation Code, Customer Name, Table Number, Date, Time (Start-End), Status (Badge), Number of Guests.
> * **Action Buttons:** >    - **Check-in:** Update status to 'checked_in'.
> * **Cancel:** Open modal for `cancellation_reason`.
> * **No-show:** Toggle `no_show` boolean.
> 
> 
> * **Tabs:** Filter by status (All, Pending, Confirmed, Completed, Cancelled).
> 
> 

### 10. Màn hình Chi tiết Đặt bàn & Thanh toán (Reservation Details)

Xem chi tiết một đơn và thông tin thanh toán đi kèm.
**Prompt cho Stitch:**

> Create a Detailed Reservation View page.
> * **Top Section:** Summary info with big Status Badge and Reservation Code.
> * **Middle Section (Two Columns):** >    - **Left:** Customer Info & Special Requests.
> * **Right:** Table Info & Restaurant Location.
> 
> 
> * **Bottom Section:** **Payment Status** based on `payments` table (Amount, Method, Status: PENDING/PAID, Paid At).
> * **Print Button:** Option to print a reservation receipt/ticket.
> 
> 

---

## Mẹo nhỏ khi làm việc với Stitch đợt này:

1. **Dùng Enum:** Vì backend của bạn dùng Enum cho `status` (pending, confirmed...), hãy nhắc Stitch: *"Use different colored badges for statuses: success for confirmed, warning for pending, danger for cancelled"*.
2. **Khớp dữ liệu Table:** Khi làm màn hình số 6 (Sơ đồ bàn), bạn nên dùng dữ liệu mẫu từ bảng `tables` của bạn để các con số `capacity` hiện lên thật nhất.
3. **Xử lý Thời gian:** Trong Postgres của bạn là `TIME` và `DATE`, hãy nhắc Stitch dùng Input type là `date` và `time` để đồng bộ.

---

**Sau khi xong đợt này, hệ thống của bạn đã có thể vận hành được việc đặt chỗ rồi đấy! Bạn có muốn tôi chuẩn bị tiếp Batch 3 (Thực đơn - Menu & Giỏ hàng - Cart) không?**













========================================


Tuyệt vời! Tiếp tục đà này, chúng ta sẽ sang **Đợt 2**. Đợt này cực kỳ quan trọng vì nó tập trung vào nghiệp vụ cốt lõi của dự án: **Quản lý sơ đồ bàn và Quy trình đặt bàn**.

Dưới đây là Prompt cho 5 màn hình tiếp theo để bạn dán vào **Stitch**:

---

## Batch 2: Quản lý Sơ đồ Bàn & Đặt bàn (5 Màn hình)

### 6. Màn hình Sơ đồ Bàn (Table Layout Visualizer)

Đây là màn hình giúp nhân viên nhìn nhanh bàn nào trống, bàn nào đang có khách.
**Prompt cho Stitch:**

> Create a Visual Table Layout for a restaurant.
> * **Header:** Tabs for different areas based on `restaurant_areas` (e.g., Indoor, Outdoor, VIP).
> * **Main Grid:** Display tables as cards/circles.
> * **Table Status Colors:** Green (Available), Red (Occupied), Yellow (Reserved), Gray (Maintenance).
> * **Card Info:** Table Number, Capacity (e.g., "4 pax").
> * **Interactive:** Clicking a table opens a quick summary of the current reservation.
> 
> 

### 7. Màn hình Quản lý Danh sách Bàn (Tables CRUD)

Dùng để thêm/sửa/xóa thông tin kỹ thuật của bàn.
**Prompt cho Stitch:**

> Create a Table Management data grid based on the `tables` table schema.
> * **Columns:** Table Number, Area Name, Capacity, Min Persons, Status, Features (tags).
> * **Filter:** By Status and Area.
> * **Add New Table Form:** A modal with inputs for `table_number`, `capacity`, and a textarea for `position_description`.
> * **Style:** Professional, easy to scan large amounts of data.
> 
> 

### 8. Màn hình Tạo Đặt bàn (New Reservation Form)

Đây là form quan trọng nhất dành cho khách hàng hoặc nhân viên lễ tân.
**Prompt cho Stitch:**

> Create a "Book a Table" multi-step form.
> * **Step 1:** Select Date, Time (`start_time`), and Number of Guests.
> * **Step 2:** Select Table (Filtering only 'Available' tables from the `tables` list).
> * **Step 3:** Guest Info (Full Name, Phone, Email) and Occasion (Dropdown: Birthday, Anniversary, Business, etc.).
> * **Step 4:** Special Requests (Textarea) and Confirmation.
> * **UI:** Stepper component at the top to track progress.
> 
> 

### 9. Màn hình Danh sách Đặt bàn (Reservations List)

Nơi quản lý tất cả các đơn đặt bàn từ cũ đến mới.
**Prompt cho Stitch:**

> Create a Comprehensive Reservations Table based on the `reservations` schema.
> * **Columns:** Reservation Code, Customer Name, Table Number, Date, Time (Start-End), Status (Badge), Number of Guests.
> * **Action Buttons:** >    - **Check-in:** Update status to 'checked_in'.
> * **Cancel:** Open modal for `cancellation_reason`.
> * **No-show:** Toggle `no_show` boolean.
> 
> 
> * **Tabs:** Filter by status (All, Pending, Confirmed, Completed, Cancelled).
> 
> 

### 10. Màn hình Chi tiết Đặt bàn & Thanh toán (Reservation Details)

Xem chi tiết một đơn và thông tin thanh toán đi kèm.
**Prompt cho Stitch:**

> Create a Detailed Reservation View page.
> * **Top Section:** Summary info with big Status Badge and Reservation Code.
> * **Middle Section (Two Columns):** >    - **Left:** Customer Info & Special Requests.
> * **Right:** Table Info & Restaurant Location.
> 
> 
> * **Bottom Section:** **Payment Status** based on `payments` table (Amount, Method, Status: PENDING/PAID, Paid At).
> * **Print Button:** Option to print a reservation receipt/ticket.
> 
> 

---

## Mẹo nhỏ khi làm việc với Stitch đợt này:

1. **Dùng Enum:** Vì backend của bạn dùng Enum cho `status` (pending, confirmed...), hãy nhắc Stitch: *"Use different colored badges for statuses: success for confirmed, warning for pending, danger for cancelled"*.
2. **Khớp dữ liệu Table:** Khi làm màn hình số 6 (Sơ đồ bàn), bạn nên dùng dữ liệu mẫu từ bảng `tables` của bạn để các con số `capacity` hiện lên thật nhất.
3. **Xử lý Thời gian:** Trong Postgres của bạn là `TIME` và `DATE`, hãy nhắc Stitch dùng Input type là `date` và `time` để đồng bộ.

---

**Sau khi xong đợt này, hệ thống của bạn đã có thể vận hành được việc đặt chỗ rồi đấy! Bạn có muốn tôi chuẩn bị tiếp Batch 3 (Thực đơn - Menu & Giỏ hàng - Cart) không?**





======================



Batch 3: Thực đơn, Giỏ hàng & Đặt món (5 Màn hình)
11. Màn hình Danh mục Thực đơn (Menu Grid - Customer View)
Đây là trang "vàng" để khách hàng chọn món ăn. Prompt cho Stitch:

Create a Customer-facing Menu Gallery.

Top: Category filter chips (Appetizers, Main Course, Desserts, Drinks) based on categories table.

Grid: Display menu items as cards.

Card Content: image_url (top), name, description (shortened), price (formatted with 'VND'), and an 'Add to Cart' button.

Features: Search bar to find dishes by name. Sidebar showing "Popular Items".

Status: If is_available is false, show a "Sold Out" overlay.

12. Màn hình Chi tiết Món ăn (Food Detail Modal/Page)
Hiển thị đầy đủ thông tin về món ăn trước khi khách thêm vào giỏ. Prompt cho Stitch:

Create a Food Detail Modal.

Layout: Two columns. Left: Large food image. Right: Dish name, Full description, Price, and Currency.

Interactive: Quantity selector (- / +), and a Textarea for special_instructions (e.g., "no spicy", "extra sauce").

Action: Large 'Add to Cart' button showing the total price dynamically.

13. Màn hình Giỏ hàng (Shopping Cart/Pre-orders)
Quản lý các món đã chọn dựa trên bảng cart_items. Prompt cho Stitch:

Create a Shopping Cart UI based on the cart_items table.

List: Display rows of items with: Small image, Dish Name, Quantity (adjustable), Subtotal, and a 'Remove' (Trash icon) button.

Summary Sidebar: Order Total, Taxes, and a "Link to Reservation" dropdown (to attach this cart to a specific reservation_id).

Action: 'Proceed to Pre-order' button.

14. Màn hình Quản lý Thực đơn (Admin Menu Management)
Dành cho chủ nhà hàng cập nhật giá và món mới. Prompt cho Stitch:

Create an Admin Menu Management table.

Columns: Image (thumbnail), Name, Category, Price, Availability Toggle, Created Date.

Features: 'Add New Dish' button opens a form with image_url upload, price input, and currency selector.

Edit/Delete: Options to update dish info or soft delete (deleted_at).

Style: Business dashboard style with bulk action checkboxes.

15. Màn hình Quản lý Khu vực (Restaurant Areas)
Quản lý các khu vực ngồi trong nhà hàng (Indoor, Outdoor, v.v.). Prompt cho Stitch:

Create a Restaurant Areas management page based on the restaurant_areas table.

Card View: Each area is a card showing: Name, Capacity, Status (Badge), Smoking Allowed (Icon), Outdoor (Icon).

Details: Show total number of tables currently assigned to each area.

Form: Add/Edit area with checkboxes for smoking_allowed and outdoor.

Lưu ý quan trọng cho Đợt 3:
Tiền tệ (Currency): Trong cấu hình của bạn, mặc định là VND. Hãy nhắc Stitch format số tiền theo kiểu Việt Nam (ví dụ: 50.000đ thay vì $50).

Logic Giỏ hàng: Vì bạn có bảng pre_orders, hãy giải thích với Stitch rằng: "When the user clicks 'Proceed', the items from cart_items should be converted into pre_orders linked to a reservation_id".

Lỗi hình ảnh: Vì bạn đang chạy local, nếu chưa có link ảnh thật, hãy bảo Stitch: "Use placeholder images if image_url is empty".





