import { create } from "zustand";
import { User } from "../types";
import { updateUser } from "../lib/api/endpoints";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, isLoading: false, error: null }),
  updateUserProfile: async (data) => {
    set({ isLoading: true });
    try {
      const response = await updateUser(data.id!, data);
      set({ user: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: "Failed to update user profile" });
    }
  },
}));
