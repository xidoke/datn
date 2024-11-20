import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";
import { FileStorageModule } from "src/file-storage/file-storage.module";

@Module({
  imports: [AuthModule, FileStorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
