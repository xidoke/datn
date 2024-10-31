import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Chấp nhận mọi domain, hoặc chỉ định cụ thể nếu cần bảo mật hơn
  });
  await app.listen(8000);
}
bootstrap();
