import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const { isLoading, error, login, register, logout, reset, isAuthenticated } =
    useAuthStore();;
  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    reset,
  };
};
