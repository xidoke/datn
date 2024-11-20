import { create } from "zustand";
import {
  workspaceMemberSlice,
  WorkspaceMemberSlice,
} from "./slices/workspace-member.slice";
import { persist } from "zustand/middleware";

export type MemberStore = WorkspaceMemberSlice;

export const useMemberStore = create<MemberStore>()(
  persist(
    (...a) => ({
      ...workspaceMemberSlice(...a),
    }),
    {
      name: "member-store",
    },
  ),
);
