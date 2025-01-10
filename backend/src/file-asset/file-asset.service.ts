import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FileStorageService } from "../file-storage/file-storage.service";

interface FileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class FileAssetService {
  constructor(
    private prisma: PrismaService,
    private fileStorage: FileStorageService,
  ) {}

  async createFileAsset(data: {
    file: FileData;
    entityType: string;
    entityId: string;
    workspaceId: string;
    userId: string;
  }) {
    const { file, entityType, entityId, workspaceId, userId } = data;
    const filename = `${file.originalname}`;

    try {
      const filePath = await this.fileStorage.saveFile(file.buffer, filename);

      const asset = await this.prisma.fileAsset.create({
        data: {
          asset: filePath,
          attributes: {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
          },
          size: file.size,
          entityType,
          workspace: { connect: { id: workspaceId } },
          createdBy: { connect: { id: userId } },
          [this.getEntityField(entityType)]: { connect: { id: entityId } },
        },
      });
      return {
        asset,
        fileUrl: this.fileStorage.getFileUrl(filePath),
      };
    } catch (error) {
      throw error;
    }
  }

  async getFileAsset(id: string) {
    const asset = await this.prisma.fileAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException("Asset not found");

    return {
      asset,
      fileUrl: this.fileStorage.getFileUrl(asset.asset),
    };
  }

  async updateFileAsset(
    id: string,
    data: { isUploaded: boolean; attributes?: any },
  ) {
    try {
      const asset = await this.prisma.fileAsset.update({
        where: { id },
        data: {
          isUploaded: data.isUploaded,
          attributes: data.attributes,
        },
      });

      if (data.isUploaded && !asset.storageMetadata) {
        const metadata = await this.getAssetMetadata(asset.asset);
        await this.prisma.fileAsset.update({
          where: { id },
          data: { storageMetadata: metadata },
        });
      }

      return asset;
    } catch {
      throw new NotFoundException("Asset not found or update failed");
    }
  }

  async deleteFileAsset(id: string) {
    const asset = await this.prisma.fileAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException("Asset not found");

    try {
      await this.fileStorage.deleteFile(asset.asset);
      return this.prisma.fileAsset.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException("Failed to delete file asset");
    }
  }

  async restoreFileAsset(id: string) {
    try {
      return await this.prisma.fileAsset.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null },
      });
    } catch {
      throw new NotFoundException("Asset not found or restore failed");
    }
  }

  async bulkUpdateFileAssets(
    assetIds: string[],
    data: { entityId: string; entityType: string },
  ) {
    try {
      return await this.prisma.fileAsset.updateMany({
        where: { id: { in: assetIds } },
        data: {
          [this.getEntityField(data.entityType)]: {
            connect: { id: data.entityId },
          },
        },
      });
    } catch {
      throw new BadRequestException("Failed to update file assets");
    }
  }

  private getEntityField(entityType: string): string {
    switch (entityType) {
      case "USER_AVATAR":
      case "USER_COVER":
        return "user";
      case "WORKSPACE_LOGO":
        return "workspace";
      case "PROJECT_COVER":
        return "project";
      case "ISSUE_ATTACHMENT":
      case "ISSUE_DESCRIPTION":
        return "issue";
      default:
        throw new BadRequestException("Invalid entity type");
    }
  }

  private async getAssetMetadata(assetName: string) {
    try {
      const stats = await this.fileStorage.getFileStats(assetName);
      return {
        size: stats.size,
        lastModified: stats.mtime,
      };
    } catch (error) {
      console.error("Error fetching asset metadata:", error);
      return null;
    }
  }
}
