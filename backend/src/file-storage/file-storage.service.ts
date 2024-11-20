// src/file-storage/file-storage.service.ts
import { Injectable, PayloadTooLargeException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promises as fs } from "fs";
import { Stats } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FileStorageService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>("UPLOAD_DIR", "uploads");
    this.maxFileSize = this.configService.get<number>(
      "MAX_FILE_SIZE",
      5 * 1024 * 1024,
    ); // 5MB default
  }

  async saveFile(
    fileBuffer: Buffer,
    originalFilename: string,
  ): Promise<string> {
    if (fileBuffer.length > this.maxFileSize) {
      throw new PayloadTooLargeException("File size exceeds the allowed limit");
    }

    await fs.mkdir(this.uploadDir, { recursive: true });
    const uniqueFilename = this.generateUniqueFilename(originalFilename);
    const filePath = this.getFilePath(uniqueFilename);
    await fs.writeFile(filePath, fileBuffer);
    return uniqueFilename;
  }

  private generateUniqueFilename(originalFilename: string): string {
    const fileExtension = path.extname(originalFilename);
    const baseFilename = path.basename(originalFilename, fileExtension);
    const timestamp = Date.now();
    const uniqueId = uuidv4().slice(0, 8);
    return `${baseFilename}-${timestamp}-${uniqueId}${fileExtension}`;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  getFileUrl(filename: string): string {
    return `/${process.env.UPLOAD_DIR}/${filename}`;
  }

  async getFileStats(filename: string): Promise<Stats> {
    const filePath = this.getFilePath(filename);
    return fs.stat(filePath);
  }

  async deleteFile(filename: string): Promise<boolean> {
    const filePath = this.getFilePath(filename);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, which is fine in this case
        return false;
      }
      // If it's a different error, we should probably throw it
      throw error;
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      await fs.access(this.getFilePath(filename));
      return true;
    } catch {
      return false;
    }
  }
}
