import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { WorkspaceModule } from "./workspace/workspace.module";
import { CognitoService } from "./auth/cognito.service";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from "./project/project.module";
import { IssueModule } from "./issue/issue.module";
import { FileStorageModule } from "./file-storage/file-storage.module";
import { FileAssetModule } from "./file-asset/file-asset.module";
import { ConfigModule } from "@nestjs/config";
import { WorkspaceInvitationsModule } from "./workspace-invitations/workspace-invitations.module";
import { StateModule } from './state/state.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  controllers: [],
  providers: [AppService, CognitoService],
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PrismaModule,
    WorkspaceModule,
    AuthModule,
    ProjectModule,
    IssueModule,
    FileStorageModule,
    FileAssetModule,
    WorkspaceInvitationsModule,
    StateModule,
    WorkspaceMemberModule,
    PermissionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
