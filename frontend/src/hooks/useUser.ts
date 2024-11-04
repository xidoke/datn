import useSWR from "swr";
import { useUserStore } from "@/stores/userStore";
import { fetchCurrentUser } from "@/lib/api/endpoints";
import { User } from "@/types";

export const useUser = () => {
  const {
    user,
    isLoading: storeLoading,
    error: storeError,
    updateUserProfile,
  } = useUserStore();

  const {
    data,
    error: swrError,
    isLoading: swrLoading,
    mutate,
  } = useSWR<{ data: User }>("currentUser", fetchCurrentUser, {
    onSuccess: (response) => {
      // Update the store with the fetched data
      useUserStore.getState().setUser(response.data);
    },
  });

  return {
    user: user || data?.data,
    isLoading: storeLoading || swrLoading,
    error: storeError || swrError,
    updateUserProfile,
    refetchUser: mutate,
  };
};
