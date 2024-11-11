"use client";

import { ContentWrapper } from "@/components/content-wrapper";
import WorkspaceHeader from "./header";

const WorkspacePage = () => {
  return (
    <>
      <WorkspaceHeader />
      <ContentWrapper>
        <div>Hello World!</div>
      </ContentWrapper>
    </>
  );
};

export default WorkspacePage;
