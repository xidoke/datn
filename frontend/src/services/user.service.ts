import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { User } from "@/types";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<User> {
    return this.get("/users/me", { validateStatus: null })
      .then((response) => response?.data)
      .catch((error) => {
        console.error(error);

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(
            error.response.data.message || "Failed to fetch user",
          );
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error("No response received from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error("Error setting up the request");
        }
      });
  }

  async updateLastWorkspaceSlug(slug: string): Promise<string> {
    return this.patch("/users/me", { lastWorkspaceSlug: slug })
      .then((response) => response?.data.lastWorkspaceSlug)
      .catch((error) => {
        if (error.response) {
          throw new Error(
            error.response.data.message ||
              "Failed to update last workspace slug",
          );
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  async updateUser(firstName: string, lastName: string): Promise<User> {
    return this.patch("/users/me", { firstName, lastName })
      .then((response) => response?.data)
      .catch((error) => {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Failed to update user",
          );
        } else if (error.request) {
          throw new Error("No response received from server");
        } else {
          throw new Error("Error setting up the request");
        }
      });
  }

  // In UserService class
  async updateUserAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data || error;
      });
  }
}
