import { useAuthStore } from "@/stores/authStore";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(this.handleRequestInterceptor);
    this.axiosInstance.interceptors.response.use(
      this.handleResponseInterceptor,
      this.handleErrorInterceptor,
    );
  }

  private handleRequestInterceptor = (config: AxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  };

  private handleResponseInterceptor = (response: AxiosResponse) => {
    return response.data;
  };

  private handleErrorInterceptor = async (error: any) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshAccessToken();
        const accessToken = useAuthStore.getState().accessToken;
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        return this.axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  };

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T, T>(url, config);
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.post<T, T>(url, data, config);
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.put<T, T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T, T>(url, config);
  }
}

export const apiClient = new ApiClient();
