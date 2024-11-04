import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../stores/userStore";
import * as api from "../lib/api/endpoints";

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !user) {
      setIsLoading(true);
      try {
        const response = await api.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // If fetching user data fails, we should log out the user
        await logout();
      } finally {
        setIsLoading(false);
      }
    }
  }, [setUser, user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.login(email, password);
        console.log(response.data);
        debugger;
        console.dir(response.data.user);
        setUser(response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      } catch (err) {
        setError(
          err.response.data.message ||
            "Failed to login. Please check your credentials.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.register(
          email,
          password,
          firstName,
          lastName,
        );
        setUser(response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        router.push("/dashboard");
      } catch (err) {
        setError("Failed to register. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.logout();
      setUser(null);
      localStorage.removeItem("authToken");
      router.push("/login");
    } catch (err) {
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser]);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.forgotPassword(email);
      // Show success message or redirect to a confirmation page
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await api.resetPassword(token, newPassword);
        router.push("/login");
      } catch (err) {
        setError("Failed to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await api.changePassword(oldPassword, newPassword);
        // Show success message
      } catch (err) {
        setError("Failed to change password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    checkAuth,
  };
};
