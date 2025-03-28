// src/file-asset/file-asset.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
  Delete,
  Patch,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileAssetService } from "./file-asset.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { CognitoAuthGuard } from "src/auth/guards/cognito.guard";
import { Role } from "src/auth/enums/role.enum";
import { CreateFileAssetDto } from "./dto/create-file-asset.dto";

@Controller("file-assets")
@UseGuards(CognitoAuthGuard)
export class FileAssetController {
  constructor(private readonly fileAssetService: FileAssetService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @Roles(Role.ADMIN, Role.USER)
  async createFileAsset(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileAssetDto: CreateFileAssetDto,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.fileAssetService.createFileAsset({
      file: {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      ...createFileAssetDto,
    });
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.USER)
  async getFileAsset(@Param("id") id: string) {
    return this.fileAssetService.getFileAsset(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.USER)
  async updateFileAsset(
    @Param("id") id: string,
    @Body() updateData: { isUploaded: boolean; attributes?: any },
  ) {
    return this.fileAssetService.updateFileAsset(id, updateData);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.USER)
  async deleteFileAsset(@Param("id") id: string) {
    return this.fileAssetService.deleteFileAsset(id);
  }

  @Post(":id/restore")
  @Roles(Role.ADMIN)
  async restoreFileAsset(@Param("id") id: string) {
    return this.fileAssetService.restoreFileAsset(id);
  }

  @Post("bulk-update")
  @Roles(Role.ADMIN)
  async bulkUpdateFileAssets(
    @Body("assetIds") assetIds: string[],
    @Body("entityId") entityId: string,
    @Body("entityType") entityType: string,
  ) {
    return this.fileAssetService.bulkUpdateFileAssets(assetIds, {
      entityId,
      entityType,
    });
  }
}
