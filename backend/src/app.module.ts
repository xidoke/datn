import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { WorkspaceModule } from "./workspace/workspace.module";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from "./project/project.module";
import { IssueModule } from "./issue/issue.module";
import { FileStorageModule } from "./file-storage/file-storage.module";
import { FileAssetModule } from "./file-asset/file-asset.module";
import { ConfigModule } from "@nestjs/config";
import { WorkspaceInvitationsModule } from "./workspace-invitations/workspace-invitations.module";
import { StateModule } from "./state/state.module";
import { WorkspaceMemberModule } from "./workspace-member/workspace-member.module";
import { PermissionModule } from "./permission/permission.module";
import { LabelModule } from "./label/label.module";

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot(),
    // global module
    PrismaModule,
    PermissionModule,
    AuthModule,
    // feature modules
    UserModule,
    WorkspaceModule,
    ProjectModule,
    IssueModule,
    FileStorageModule,
    FileAssetModule,
    WorkspaceInvitationsModule,
    StateModule,
    WorkspaceMemberModule,
    LabelModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
