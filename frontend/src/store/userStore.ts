// store/userStore.ts
import { IUser } from "@/types/users";
import { create } from "zustand";

interface UserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
