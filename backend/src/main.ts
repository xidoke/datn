import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as fs from "fs";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./common/response.interceptor";

async function bootstrap() {
  // Đường dẫn tới chứng chỉ SSL

  // const httpsOptions = {
  //   key: fs.readFileSync("/home/ec2-user/certs/xidoke.id.vn/privkey.pem"), // Private key
  //   cert: fs.readFileSync("/home/ec2-user/certs/xidoke.id.vn/fullchain.pem"), // Full chain certificate
  // };

  // Khởi tạo ứng dụng với HTTPS
  const app = await NestFactory.create<NestExpressApplication>(AppModule
  //   ,
  //    {
  //   httpsOptions,
  // }
);

  // Cấu hình static assets
  app.useStaticAssets(join(__dirname, "../../uploads"), {
    prefix: "/uploads/",
  });

  // CORS configuration
  const allowedOrigins = [
    "https://xidok.vercel.app", // Production
    "http://localhost:3000",  // Development
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((o) =>
          typeof o === "string" ? o === origin : o.test(origin),
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      // "ngrok-skip-browser-warning",
    ],
  });

  // Global Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.property] = Object.values(error.constraints);
        });
        return new BadRequestException({
          status: false,
          message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
          errors: formattedErrors,
        });
      },
    }),
  );

  // Cookie Parser
  app.use(cookieParser());

  // Lắng nghe trên HTTPS, cổng 443
  // await app.listen(443);

  await app.listen(8000);
  // console.log("HTTPS Server is running on port 443");
}

bootstrap();
