import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8000);
  console.log("Server is running on http://localhost:8000");
}
bootstrap();
