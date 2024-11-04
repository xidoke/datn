// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api/api-client";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{
            user: User;
          }>("/auth/login", { email, password });
          set({
            user: response.user,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to login. Please check your credentials.",
            isLoading: false,
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
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{
            user: User;
          }>("/auth/register", { email, password, firstName, lastName });
          set({
            user: response.user,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Registration failed. Please try again.",
            isLoading: false,
          });
        }
      },
      logout: async () => {
        try {
          // Optimistic logout: Immediately clear user data
          set({ user: null, error: null, isLoading: true });

          // Notify the backend
          await apiClient.post("/auth/logout");

          // Ensure isLoading is set to false after the request completes
          set({ isLoading: false });
        } catch (error) {
          console.error("Logout error:", error);

          // Set error state and isLoading to false
          set({
            error:
              error.response?.data?.message ||
              "Logout failed. Please try again.",
            isLoading: false,
          });

          // Optionally, you might want to restore the user state if logout fails
          // const previousUser = get().user;
          // set({ user: previousUser });
        }
      },
      updateUser: (updatedUser: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
