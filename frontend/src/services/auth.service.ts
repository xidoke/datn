import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async signOut() {
    return await this.post('/auth/logout');
  }
}
