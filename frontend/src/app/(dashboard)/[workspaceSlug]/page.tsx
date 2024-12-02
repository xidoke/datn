"use client";

import { ContentWrapper } from "@/components/content-wrapper";
import WorkspaceHeader from "./header";
import { DashBoardWorkspace } from "@/components/dashboard";

const WorkspacePage = () => {
  return (
    <>
      <WorkspaceHeader />
      <ContentWrapper>
        <DashBoardWorkspace/>
      </ContentWrapper>
    </>
  );
};

export default WorkspacePage;
