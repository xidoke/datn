/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/api-client";
import { IUser } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  isLoading: boolean;
  error: string | undefined;
  data: IUser | undefined;
  lastWorkspaceSlug: string | undefined;
  isLoadingWorkspaceSlug: boolean;
  errorWorkspaceSlug: string | undefined;
}

interface UserActions {
  fetchCurrentUser: () => Promise<IUser | undefined>;
  updateLastWorkspaceSlug: (slug: string) => Promise<string | undefined>;
  updateUser: (firstName: string, lastName: string) => any;
  updateUserAvatar: (avatarFile: File) => any;
  reset: () => void;
}

export type UserStore = UserState & UserActions;

const initialState: UserState = {
  isLoading: false,
  error: undefined,
  data: undefined,
  lastWorkspaceSlug: undefined,
  isLoadingWorkspaceSlug: false,
  errorWorkspaceSlug: undefined,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await apiClient.get<IUser>("/users/me");
          set({
            data: user,
            isLoading: false,
            lastWorkspaceSlug: user.lastWorkspaceSlug,
          });
          return user;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch user",
            isLoading: false,
          });
          return undefined;
        }
      },

      updateLastWorkspaceSlug: async (slug) => {
        set({ isLoadingWorkspaceSlug: true, errorWorkspaceSlug: undefined });
        try {
          const user = await apiClient.patch<IUser>("/users/me", {
            lastWorkspaceSlug: slug,
          });
          set({
            lastWorkspaceSlug: user.lastWorkspaceSlug,
            isLoadingWorkspaceSlug: false,
          });
          return user.lastWorkspaceSlug;
        } catch (error: any) {
          set({
            errorWorkspaceSlug:
              error.response?.data?.message ||
              "Failed to update last workspace slug",
            isLoadingWorkspaceSlug: false,
          });
          return undefined;
        }
      },
      updateUser: async (firstName, lastName) => {
        set({ isLoading: true, error: undefined });
        try {
          const user = await apiClient.patch<IUser>("/users/me", {
            firstName,
            lastName,
          });
          set({ data: user, isLoading: false });
          return { success: true, user };
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update user";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },
      updateUserAvatar: async (file: File) => {
        try {
          const formData = new FormData();
          formData.append("avatar", file);

          const response : IUser = await apiClient.post("/users/me/avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          set((state) => ({
            data: state.data
              ? {
                  ...state.data,
                  avatarUrl: response.avatarUrl,
                }
              : undefined,
          }));
        } catch (error) {
          console.error("Failed to update user avatar:", error);
          throw new Error("Failed to update avatar. Please try again.");
        }
      },

      reset: () => set(initialState),
    }),

    {
      name: "user-storage",
    },
  ),
);

export const useUser = () => useUserStore();
