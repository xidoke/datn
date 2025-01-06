## Đồ án tốt nghiệp kỳ 2024.1 - Khoa học máy tính

# Hướng dẫn khởi chạy dự án

## Yêu cầu hệ thống
- Node.js (được code trên 20.14.0)
- npm (được code trên 10.8.3)

## Khởi chạy dự án Backend

1. Cài đặt các gói phụ thuộc:
    ```bash
    cd backend
    npm install 
    npx prisma generate
    ```

2. Cấu hình môi trường:
    - Tạo file `.env` trong thư mục `backend` dựa vào `.env.example` và cấu hình các biến môi trường cần thiết. Lưu ý rằng dự án sử dụng AWS Cognito làm bên thứ ba hỗ trợ xác thực. Xem hướng dẫn ở AWS.
    - Về Database, tôi sử dụng postgreSQL 17.0, bạn có thể sử dụng file backup.sql để tạo database bằng pg_dump hoặc điều chỉnh `.env` đúng với database của bạn. Sau đó có thể sử dụng `npx prisma db push` để tạo bảng.

3. (optional) Tạo tài khoản admin system (thông tin tài khoản xem ở file ./prisma/seed.ts): 
    ```bash
    npm run seed
    ```
4. Khởi chạy server:
    ```bash
    npm start
    ```

5. Hoặc build và chạy bản tối ưu (production):
    ```bash
    npm run build
    npm run start:prod
    ```

## Khởi chạy dự án Frontend

1. Cài đặt các gói phụ thuộc:
    ```bash
    cd frontend
    npm install
    ```

2. Cấu hình môi trường:
    - Tạo file `.env` trong thư mục `frontend` và cấu hình các biến môi trường cần thiết. Để sử dụng tính năng trợ lý AI, cần cung cấp Gemini API KEY 

3. Build và chạy ứng dụng:
    ```bash
    npm run build
    npm run start
    ```

## Ghi chú
- Đảm bảo rằng các dịch vụ cần thiết (như cơ sở dữ liệu) đang chạy trước khi khởi chạy dự án.
- Kiểm tra lại các biến môi trường trong file `.env` để đảm bảo chúng đúng với cấu hình của bạn.
- Nếu bạn là giáo viên của tôi hãy liên hệ email do.pd200154@sis.hust.edu.vn để được cấp các file `.env` hoặc xem sản phẩm được triển khai:
- Frontend đang được tôi triển khai tại `https//:xidok.vercel.app`
- Backend, database đang được tôi triển khai trên EC2 và RDS (AWS). `https://xidoke.id.vn`, Tuy nhiên chắc là tôi sẽ dừng khi xong ĐATN. (to 30/1/2025)