import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async login(email: string, password: string) {
    const response = await this.post('/auth/login', { email, password });
    return response.data;
  }

  async signup(userData: any) {
    const response = await this.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await this.post('/auth/logout');
    return response.data;
  }
}
