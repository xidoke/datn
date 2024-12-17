import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./common/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "../../uploads"), {
    prefix: "/uploads/",
  });
  const allowedOrigins = [
    "https://xidok.vercel.app",
    "http://localhost:3000",
    /^https:\/\/.*\.ngrok-free\.app$/, // Cho phép tất cả subdomain của ngrok-free.app
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
      "ngrok-skip-browser-warning",
    ],
  });

  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

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

  app.use(cookieParser());
  await app.listen(8000);
  console.log("Server is running");
}
bootstrap();
