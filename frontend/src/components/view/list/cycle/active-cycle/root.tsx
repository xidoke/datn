"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

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

interface IActiveCycleDetails {
  workspaceSlug: string;
  projectId: string;
}

export const ActiveCycleRoot: React.FC<IActiveCycleDetails> = (props) => {
  const { workspaceSlug, projectId } = props;
  const { activeCycleId } = useCycleStore();
  // const { currentProjectActiveCycle, currentProjectActiveCycleId } = useCycle();
  // const {
  //   handleFiltersUpdate,
  //   cycle: activeCycle,
  //   cycleIssueDetails,
  // } = useCyclesDetails({ workspaceSlug, projectId, cycleId: currentProjectActiveCycleId });

  return (
    <>
      <Disclosure as="div" className="flex flex-shrink-0 flex-col" defaultOpen>
        {({ open }) => (
          <>
            <DisclosureButton className="sticky top-0 z-[2] w-full flex-shrink-0 border-b border-custom-border-200 bg-custom-background-90 cursor-pointer">
              <CycleListGroupHeader title="Active cycle" type="current" isExpanded={open} />
            </DisclosureButton>
            <DisclosurePanel>
              <Row className="flex flex-col gap-5">
                {activeCycleId}
              </Row>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
};
