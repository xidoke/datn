# Demo
~~Dự án triển khai trên Vercel (Frontend), EC2 (Backend), RDS (Database). Live: https:xidok.vercel.app~~

Video demo tại: https://drive.google.com/drive/folders/1dpt5NvPp9y8AkW_uDlb4qhMyPDd6Reb8

# Hướng Dẫn Triển Khai Dự Án

## 1. Yêu Cầu Hệ Thống
Trước khi khởi chạy dự án, vui lòng đảm bảo hệ thống của bạn đáp ứng các yêu cầu sau:
- **Node.js**: Phiên bản >= 20.14.0
- **npm**: Phiên bản >= 10.8.3
- **PostgreSQL**: Phiên bản 17.0

## 2. Khởi Chạy Backend

### 2.1. Cài Đặt Các Gói Phụ Thuộc
Chạy các lệnh sau để cài đặt và thiết lập môi trường cho backend:
```bash
cd backend
npm install
npx prisma generate
```

### 2.2. Cấu Hình Môi Trường
- Sao chép tệp `.env.example` thành `.env` trong thư mục `backend` và cấu hình các biến môi trường cần thiết.
- Hệ thống sử dụng **AWS Cognito** để xác thực người dùng. Vui lòng tham khảo tài liệu của AWS để thiết lập chính xác.
- Cấu hình **Cơ sở dữ liệu**:
  - Nếu sử dụng PostgreSQL, có thể khôi phục cơ sở dữ liệu từ `backup.sql` bằng `pg_dump`.
  - Hoặc cập nhật thông tin kết nối trong `.env` và chạy lệnh sau để tạo bảng:
    ```bash
    npx prisma db push
    ```

### 2.3. (Tuỳ Chọn) Tạo Tài Khoản Quản Trị Hệ Thống
Nếu cần tài khoản quản trị, chạy lệnh sau (thông tin tài khoản được định nghĩa trong `./prisma/seed.ts`):
```bash
npm run seed
```

### 2.4. Khởi Chạy Server
- Chạy chế độ phát triển:
  ```bash
  npm start
  ```
- Hoặc build và chạy ở môi trường sản xuất:
  ```bash
  npm run build
  npm run start:prod
  ```

## 3. Khởi Chạy Frontend

### 3.1. Cài Đặt Các Gói Phụ Thuộc
```bash
cd frontend
npm install
```

### 3.2. Cấu Hình Môi Trường
- Tạo tệp `.env` trong thư mục `frontend` và thiết lập các biến môi trường phù hợp.
- Nếu sử dụng tính năng trợ lý AI, vui lòng cung cấp **Gemini API Key**.

### 3.3. Build và Chạy Ứng Dụng
```bash
npm run build
npm run start
```

## Biến môi trường cần thiết:
- Tính năng liên quan đến generative AI (OPTIONAL): API KEY
- AWS Cognito (REQUIRED): Chi tiết xem tại backend/.env.example
