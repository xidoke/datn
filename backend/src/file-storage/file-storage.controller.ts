import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  PayloadTooLargeException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Get,
  Param,
  Res,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileStorageService } from "./file-storage.service";
import { createReadStream } from "fs";
import { lookup } from "mime-types";
import { Response } from "express";

@Controller("file-storage")
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB limit
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      const savedFilename = await this.fileStorageService.saveFile(
        file.buffer,
        file.originalname,
      );
      const fileUrl = this.fileStorageService.getFileUrl(savedFilename);
      return {
        message: "File uploaded successfully",
        originalFilename: file.originalname,
        savedFilename: savedFilename,
        fileUrl: fileUrl,
      };
    } catch (error) {
      if (error instanceof PayloadTooLargeException) {
        throw new PayloadTooLargeException(
          "File size exceeds the allowed limit",
        );
      }
      throw new BadRequestException("Failed to upload file");
    }
  }

  @Get(":filename")
  async getFile(
    @Param("filename") filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!(await this.fileStorageService.fileExists(filename))) {
      throw new NotFoundException("File not found");
    }

    const filePath = this.fileStorageService.getFilePath(filename);
    const file = createReadStream(filePath);
    const stats = await this.fileStorageService.getFileStats(filename);
    const mimeType = lookup(filename) || "application/octet-stream";

    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Content-Length": stats.size,
    });

    return new StreamableFile(file);
  }

  @Get("stats/:filename")
  async getFileStats(@Param("filename") filename: string) {
    if (!(await this.fileStorageService.fileExists(filename))) {
      throw new NotFoundException("File not found");
    }

    const stats = await this.fileStorageService.getFileStats(filename);
    return {
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  }
}
