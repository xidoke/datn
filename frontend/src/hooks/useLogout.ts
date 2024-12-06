// useLogout.ts
import { useAuthStore } from "@/stores/authStore";
import { useCycleStore } from "@/stores/cycleStore";
import { useFilterStore } from "@/stores/filterStore";
import useIssueStore from "@/stores/issueStore";
import { useMemberStore } from "@/stores/member/memberStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { useViewStore } from "@/stores/viewStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { mutate } from "swr";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const resetUser = useUserStore((state) => state.reset);
  const resetWorkspace = useWorkspaceStore((state) => state.reset);
  const resetMember = useMemberStore((state) => state.resetAll);
  const resetProject = useProjectStore((state) => state.reset);
  const resetLabel = useProjectLabelStore((state) => state.reset);
  const resetState = useProjectStateStore((state) => state.reset);
  const resetCycle = useCycleStore((state) => state.reset);
  const resetView = useViewStore((state) => state.reset);
  const resetFilter = useFilterStore((state) => state.reset);
  const resetIssue = useIssueStore((state) => state.reset);
  const resetComment = useIssueStore((state) => state.reset);

  const handleLogout = async () => {
    await logout();
    // reset all stores
    resetUser();
    resetWorkspace();
    resetMember();
    resetProject();
    resetLabel();
    resetState();
    resetIssue();
    resetCycle();
    resetView();
    resetFilter();
    resetComment();
    // clear cache
    await mutate(() => true, undefined, { revalidate: false });
  };

  return handleLogout;
};
