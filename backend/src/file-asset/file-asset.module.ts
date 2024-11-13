import { Module } from "@nestjs/common";
import { FileAssetService } from "./file-asset.service";
import { FileAssetController } from "./file-asset.controller";
import { FileStorageModule } from "src/file-storage/file-storage.module";

@Module({
  imports: [FileStorageModule],
  providers: [FileAssetService],
  controllers: [FileAssetController],
})
export class FileAssetModule {}
