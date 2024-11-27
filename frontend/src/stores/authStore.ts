/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { LoginDto, RegisterDto, User } from "@/types";
import { AuthService } from "@/services/auth.service";

interface AuthState {
  isLoading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
  user: User | undefined;
}
interface AuthActions {
  login: (loginDto: LoginDto) => Promise<void>;
  register: (
    registerDto: RegisterDto
  ) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

const authService = new AuthService();
export interface AuthStore extends AuthState, AuthActions {}

const initialState = {
  isLoading: false,
  error: undefined,
  isAuthenticated: false,
  user: undefined,
};
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      login: async (loginDto: LoginDto) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await authService.login(loginDto);
          useUserStore.getState().fetchCurrentUser();
          set({
            isLoading: false,
            isAuthenticated: true,
            user: result.data,
            
          });
        } catch (error : any) {
          const errorMessage = error.message || "Failed to login. Please try again.";
          set({
            error:errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },
      // Test register
      register: async ( registerDto: RegisterDto
      ) => {
        set({ isLoading: true, error: undefined });
        try {
          const result = await authService.register(registerDto);
          useUserStore.getState().fetchCurrentUser();
          set({
            isLoading: false,
            isAuthenticated: true,
            user: result.data,
          });
        } catch (error: any) {
          const errorMessage = error?.message || "Failed to register. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },
      reset: () => set(initialState),
      logout: async () => {
        try {
          // Optimistic logout: Immediately clear user data
          set({ isAuthenticated: false, error: undefined, isLoading: true });

          // Notify the backend
          await authService.signOut();

          // Ensure isLoading is set to false after the request completes
          set({ isLoading: false, user: undefined});
        } catch (error: any) {
          const errorMessage = error?.message || "Failed to logout. Please try again.";

          // Set error state and isLoading to false
          set({
            error: errorMessage,
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
