import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { User } from "@/types";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<User> {
    return this.get("/users/me")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }
}
