import useSWR from "swr";
import { useUserStore } from "@/store/userStore";
import { useCallback, useEffect } from "react";
import { IUser } from "@/types/users";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetcher function for SWR
const fetcher = async (url: string): Promise<IUser> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useUser() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<IUser>(`${API_BASE_URL}/api/me`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  // const logout = useCallback(async () => {
  //   try {
  //     await fetch(`${API_BASE_URL}/api/logout`, { method: "POST" });
  //     setUser(null);
  //     mutate(null, false);
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // }, [setUser, mutate]);

  const updateUser = useCallback(
    // TODO: Update the updateUser function to send a PATCH request to the /api/me/update endpoint
    async (updatedData: Partial<IUser>) => {
      try {
        const updatedUser = await fetcher(`${API_BASE_URL}/api/me/update`);
        setUser(updatedUser);
        mutate(updatedUser, false);
      } catch (error) {
        console.error("User update failed:", error);
      }
    },
    [setUser, mutate],
  );

  return {
    user,
    isLoading,
    isError: !!error,
    error,
    updateUser,
    mutate,
  };
}
