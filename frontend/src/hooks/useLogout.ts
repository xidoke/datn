// useLogout.ts

import { useAuthStore } from "@/stores/authStore";
import { useIssueStore } from "@/stores/issue/issueStore";
import { useMemberStore } from "@/stores/member/memberStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { mutate } from "swr";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const resetUser = useUserStore((state) => state.reset);
  const resetWorkspace = useWorkspaceStore((state) => state.reset);
  const resetMember = useMemberStore((state) => state.resetAll);
  const resetProject = useProjectStore((state) => state.reset);
  // const resetIssue = useIssueStore((state) => state.resetAll);
  // Get reset functions from other stores

  const handleLogout = async () => {
    await logout();
    // reset all stores
    resetUser();
    resetWorkspace();
    resetMember();
    resetProject();
    // resetIssue();


    // clear cache
    await mutate(() => true, undefined, { revalidate: false });
  };

  return handleLogout;
};
