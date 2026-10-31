# Phần giao diện

Không cần build hay cài thêm thư viện. Chạy `npm start` như trước.

## Đọc code theo thứ tự

1. `../index.html`: khung trang, form và các cột của bảng.
2. `styles.css`: màu sắc, khoảng cách và cách trình bày.
3. `../SelectLoader.js`: gọi API danh mục để điền vào ô chọn.
4. `transactions.js`: gọi API giao dịch, tạo các hàng trong bảng và xử lý nút View/Add.

Trong `transactions.js`, các phần được đánh số từ 1 đến 5 để dễ lần theo.
`categoriesReady` là Promise từ `SelectLoader.js`, dùng để đợi danh mục tải xong.

## Luồng hoạt động

- Mở trang → tải danh mục → tải giao dịch → hiển thị bảng.
- Bấm View → đọc khoảng thời gian → GET `/api/transactions?period=...` → cập nhật bảng.
- Bấm Add → POST `/api/transactions` → tải lại bảng theo khoảng đang chọn.

`server.js` phục vụ CSS và JavaScript trong thư mục `public` bằng `express.static`.
Phần xử lý API và database vẫn nằm ở backend.
