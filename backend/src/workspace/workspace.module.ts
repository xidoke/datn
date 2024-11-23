import { Module } from "@nestjs/common";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { UserModule } from "src/user/user.module";
import { FileStorageModule } from "src/file-storage/file-storage.module";

@Module({
  imports: [UserModule, FileStorageModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
