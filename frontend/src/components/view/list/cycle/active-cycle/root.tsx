"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

// import {
//   ActiveCycleProductivity,
//   ActiveCycleProgress,
//   ActiveCycleStats,
//   CyclesListItem,
// } from "@/components/cycles";
// import useCyclesDetails from "@/components/cycles/active-cycle/use-cycles-details";
// import { EmptyState } from "@/components/empty-state";
// constants
// import { EmptyStateType } from "@/constants/empty-state";
// import { useCycle } from "@/hooks/store";
// import { ActiveCycleIssueDetails } from "@/store/issue/cycle";
import { Row } from "@/components/ui/row";
import { CycleListGroupHeader } from "../cycle-list-group-header";
import { useCycleStore } from "@/stores/cycleStore";
import { CyclesListItem } from "../cycles-list-item";

interface IActiveCycleDetails {
  workspaceSlug: string;
  projectId: string;
}

export const ActiveCycleRoot: React.FC<IActiveCycleDetails> = (props) => {
  const { workspaceSlug, projectId } = props;
  const { activeCycleId } = useCycleStore();

  return (
    <>
      <Disclosure
        as="div"
        className="flex flex-shrink-0 flex-col bg-backdrop"
        defaultOpen
      >
        {({ open }) => (
          <>
            <DisclosureButton className="sticky top-0 z-[2] w-full flex-shrink-0 cursor-pointer border-b bg-backdrop">
              <CycleListGroupHeader
                title="Active cycle"
                type="current"
                isExpanded={open}
              />
            </DisclosureButton>
            <DisclosurePanel>
              {activeCycleId && (
                <CyclesListItem
                  cycleId={activeCycleId}
                  workspaceSlug={workspaceSlug}
                  projectId={projectId}
                />
              )}
              {!activeCycleId && (
                <Row className="flex flex-col items-center justify-center gap-5 bg-background">
                  No active cycle found
                </Row>
              )}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
};
