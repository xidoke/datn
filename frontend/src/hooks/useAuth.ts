// src/hooks/useAuth.ts
import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const { user, isLoading, error, login, register, logout, updateUser } =
    useAuthStore();
  const isAuthenticated = !!user;
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };
};
