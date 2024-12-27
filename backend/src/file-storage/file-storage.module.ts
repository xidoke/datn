import { Global, Module } from "@nestjs/common";
import { FileStorageService } from "./file-storage.service";
import { FileStorageController } from "./file-storage.controller";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  providers: [FileStorageService, ConfigService],
  controllers: [FileStorageController],
  exports: [FileStorageService],
})
export class FileStorageModule {}
