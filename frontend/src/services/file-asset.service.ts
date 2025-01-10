import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
import { ApiResponse } from "@/types";

export interface IFileAsset {
  id: string;
  asset: string;
  attributes: {
    name: string;
    type: string;
    size: number;
  };
  size: number;
  entityType: string;
  entityId: string;
  workspaceId: string;
  isUploaded: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFileAssetDto {
  file: File;
  entityType: string;
  entityId: string;
  workspaceId: string;
  userId: string;
}

export interface IUpdateFileAssetDto {
  isUploaded: boolean;
  attributes?: any;
}

export class FileAssetService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async createFileAsset(data: ICreateFileAssetDto): Promise<{ asset: IFileAsset; fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('entityType', data.entityType);
    formData.append('entityId', data.entityId);
    formData.append('workspaceId', data.workspaceId);
    formData.append('userId', data.userId);

    return this.post<{ asset: IFileAsset; fileUrl: string }>('file-assets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data;
    });
  }

  async getFileAsset(id: string): Promise<{ asset: IFileAsset; fileUrl: string }> {
    return this.get<{ asset: IFileAsset; fileUrl: string }>(`file-assets/${id}`).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data;
    });
  }

  async updateFileAsset(id: string, data: IUpdateFileAssetDto): Promise<IFileAsset> {
    return this.patch<IFileAsset>(`file-assets/${id}`, data).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data;
    });
  }

  async deleteFileAsset(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`file-assets/${id}`).then(
      (response) => response.data
    ).catch((error) => {
      throw error?.response?.data;
    });
  }

  async restoreFileAsset(id: string): Promise<IFileAsset> {
    return this.post<IFileAsset>(`file-assets/${id}/restore`).then(
      (response) => response.data.data
    ).catch((error) => {
      throw error?.response?.data;
    });
  }

  async bulkUpdateFileAssets(assetIds: string[], entityId: string, entityType: string): Promise<ApiResponse<null>> {
    return this.post<null>('file-assets/bulk-update', { assetIds, entityId, entityType }).then(
      (response) => response.data
    ).catch((error) => {
      throw error?.response?.data;
    });
  }
}

