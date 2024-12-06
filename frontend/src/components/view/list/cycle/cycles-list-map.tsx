// components
import { CyclesListItem } from "@/components/view/list/cycle/cycles-list-item";

type Props = {
  cycleIds: string[];
  projectId: string;
  workspaceSlug: string;
  isCompleted?: boolean;
};

export const CyclesListMap: React.FC<Props> = (props) => {
  const { cycleIds, projectId, workspaceSlug, isCompleted = false } = props;

  return (
    <>
      {cycleIds.map((cycleId) => (
        <CyclesListItem key={cycleId} cycleId={cycleId} workspaceSlug={workspaceSlug} projectId={projectId} isCompleted={isCompleted}/>
      ))}
    </>
  );
};
