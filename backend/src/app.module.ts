import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserService } from "./user/user.service";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { WorkspaceModule } from "./workspace/workspace.module";
import { CognitoService } from "./auth/cognito.service";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from './project/project.module';

@Module({
  controllers: [AppController],
  providers: [AppService, UserService, CognitoService],
  imports: [UserModule, PrismaModule, WorkspaceModule, AuthModule, ProjectModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
