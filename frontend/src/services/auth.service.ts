import { ApiResponse, LoginDto, RegisterDto, User } from "@/types";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async register(data : RegisterDto) : Promise<ApiResponse<User>> {
    return this.post<User>('/auth/register', data).then(
      (response) => response.data
    ).catch((error) => {
      throw error?.response.data
  });
  }

  async login(data: LoginDto) : Promise<ApiResponse<User>> {
    return this.post<User>('/auth/login', data).then(
      (response) => response.data
    ).catch((error) => {
      throw error?.response.data
  });
  }

  async signOut() {
    return await this.post('/auth/logout');
  }
}
