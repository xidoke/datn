"use client";

import { ContentWrapper } from "@/components/content-wrapper";
import ProfileHeader from "./header";
import { WorkspaceMemberDashboard } from "@/components/profile";

const WorkspacePage = () => {
  return (
    <>
      <ProfileHeader />
      <ContentWrapper>
        <WorkspaceMemberDashboard />
      </ContentWrapper>
    </>
  );
};

export default WorkspacePage;
