import { Module } from "@nestjs/common";
import { FileAssetService } from "./file-asset.service";
import { FileAssetController } from "./file-asset.controller";

@Module({
  providers: [FileAssetService],
  controllers: [FileAssetController],
})
export class FileAssetModule {}
