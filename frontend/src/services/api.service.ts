/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class APIService {
  protected baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "ngrok-skip-browser-warning": "1",
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          if (error.response.data.message === 'No refresh token available') {
            console.log("hit here")
            localStorage.clear();
          }

          const currentPath = window.location.pathname;
          window.location.replace(`/${currentPath ? `?next_path=${currentPath}` : ``}`);
        }
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.request.use((config) => {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    });
  }

 get<T>(url: string, params = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.axiosInstance.get<ApiResponse<T>>(url, {
      params,
      ...config,
    });
  }

  post<T>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.axiosInstance.post<ApiResponse<T>>(url, data, config);
  }

  put<T>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.axiosInstance.put<ApiResponse<T>>(url, data, config);
  }

  patch<T>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
  }

  delete<T>(url: string, data?: Record<string, unknown>, config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.axiosInstance.delete<ApiResponse<T>>(url, { data, ...config });
  }

  request<T>(config: AxiosRequestConfig = {}): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.axiosInstance.request<ApiResponse<T>>(config);
  }
}
