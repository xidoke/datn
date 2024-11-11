/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true, // This ensures cookies are sent with requests
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.response.use(
      // this.handleResponseInterceptor,
    );
  }

  // private handleResponseInterceptor = (response: AxiosResponse): any => {
  //   return response.data;
  // };

  

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T, AxiosResponse<T>>(url, config).then(response => response.data);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post<T, AxiosResponse<T>>(url, data, config).then(response => response.data);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put<T, AxiosResponse<T>>(url, data, config).then(response => response.data);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch<T, AxiosResponse<T>>(url, data, config).then(response => response.data);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T, AxiosResponse<T>>(url, config).then(response => response.data);
  }
}

export const apiClient = new ApiClient();