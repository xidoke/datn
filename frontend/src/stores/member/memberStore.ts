import { create } from "zustand";
import {
  workspaceMemberSlice,
  WorkspaceMemberSlice,
} from "./slices/workspace-member.slice";
import { persist } from "zustand/middleware";

export type MemberStore = WorkspaceMemberSlice & { resetAll: () => void };

export const useMemberStore = create<MemberStore>()(
  persist(
    (set, get, store) => ({
      ...workspaceMemberSlice(set, get, store),
      resetAll: () => {
        get().resetWorkspaceMember();
      },
    }),
    {
      name: "member-store",
    },
  ),
);
