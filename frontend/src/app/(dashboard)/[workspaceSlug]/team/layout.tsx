"use client";
import TeamWorkspaceHeader from "./header";
import { ContentWrapper } from "@/components/content-wrapper";


export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TeamWorkspaceHeader />
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </>
  );
}
