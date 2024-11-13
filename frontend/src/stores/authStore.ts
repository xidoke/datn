/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api/api-client";

interface AuthState {
  isLoading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
}
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

export interface AuthStore extends AuthState, AuthActions {}

const initialState = {
  isLoading: false,
  error: undefined,
  isAuthenticated: false,
};
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: undefined });
        try {
          await apiClient.post("/auth/login", { email, password });
          set({
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to login. Please check your credentials.",
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },
      // Test register
      register: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
      ) => {
        set({ isLoading: true, error: undefined });
        try {
          await apiClient.post("/auth/register", {
            email,
            password,
            firstName,
            lastName,
          });
          set({
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Registration failed. Please try again.",
            isLoading: false,
          });
        }
      },
      reset: () => set(initialState),
      logout: async () => {
        try {
          // Optimistic logout: Immediately clear user data
          set({ isAuthenticated: false, error: undefined, isLoading: true });

          // Notify the backend
          await apiClient.post("/auth/logout");

          // Ensure isLoading is set to false after the request completes
          set({ isLoading: false });
        } catch (error: any) {
          console.error("Logout error:", error);

          // Set error state and isLoading to false
          set({
            error:
              error.response?.data?.message ||
              "Logout failed. Please try again.",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
