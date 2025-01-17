import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { ApiResponse, User } from "@/types";
import axios from "axios";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.get<User>(
        "/users/me",
        {},
        { validateStatus: null },
      );

      if (response && response.status === 403) {
        console.log("User is blocked");
        if (response.data.message === "User is blocked") {
          window.location.replace("/blocked");
        }
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async updateLastWorkspaceSlug(
    slug: string,
  ): Promise<ApiResponse<{ lastWorkspaceSlug: string }>> {
    try {
      const response = await this.patch<{ lastWorkspaceSlug: string }>(
        "/users/me",
        { lastWorkspaceSlug: slug },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error("Failed to update last workspace slug");
    }
  }

  async updateUser(
    firstName: string,
    lastName: string,
  ): Promise<ApiResponse<User>> {
    try {
      const response = await this.patch<User>("/users/me", {
        firstName,
        lastName,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error("Failed to update user");
    }
  }

  async updateUserAvatar(file: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await this.post<User>("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error("Failed to update user avatar");
    }
  }
}
