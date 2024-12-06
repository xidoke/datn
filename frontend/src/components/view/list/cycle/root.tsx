import React, { FC } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
// components
import { CycleListGroupHeader } from "./cycle-list-group-header";
import { ActiveCycleRoot } from "./active-cycle";

import { ERowVariant } from "@/components/ui/row";
import { ContentWrapper } from "@/components/ui/content-wrapper";
import { ListLayout } from "../list-root";
import { CyclesListMap } from "./cycles-list-map";

export interface ICyclesList {
  completedCycleIds: string[];
  upcomingCycleIds?: string[] | undefined;
  cycleIds: string[];
  workspaceSlug: string;
  projectId: string;
  isArchived?: boolean;
}

export const CyclesList: FC<ICyclesList> = (props) => {
  const {
    completedCycleIds,
    upcomingCycleIds,
    cycleIds,
    workspaceSlug,
    projectId,
    isArchived = false,
  } = props;

  return (
    <ContentWrapper variant={ERowVariant.HUGGING} className="flex-row">
      <ListLayout>
        <ActiveCycleRoot workspaceSlug={workspaceSlug} projectId={projectId} />

        {upcomingCycleIds && (
          <Disclosure
            as="div"
            className="flex flex-shrink-0 flex-col bg-backdrop"
            defaultOpen
          >
            {({ open }) => (
              <>
                <DisclosureButton className=" sticky top-0 z-[2] w-full flex-shrink-0 cursor-pointer border-b">
                  <CycleListGroupHeader
                    title="Upcoming cycle"
                    type="upcoming"
                    count={upcomingCycleIds.length}
                    showCount
                    isExpanded={open}
                  />
                </DisclosureButton>
                <DisclosurePanel>
                  <CyclesListMap
                        cycleIds={upcomingCycleIds}
                        projectId={projectId}
                        workspaceSlug={workspaceSlug}
                      />
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        )}
        <Disclosure as="div" className="flex flex-shrink-0 flex-col bg-backdrop">
          {({ open }) => (
            <>
              <DisclosureButton className="sticky top-0 z-[2] w-full flex-shrink-0 cursor-pointer border-b">
                <CycleListGroupHeader
                  title="Completed cycle"
                  type="completed"
                  count={completedCycleIds.length}
                  showCount
                  isExpanded={open}
                />
              </DisclosureButton>
              <DisclosurePanel>
                <CyclesListMap
                  cycleIds={completedCycleIds}
                  projectId={projectId}
                  workspaceSlug={workspaceSlug}
                  isCompleted
                />
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </ListLayout>
    </ContentWrapper>
  );
};
