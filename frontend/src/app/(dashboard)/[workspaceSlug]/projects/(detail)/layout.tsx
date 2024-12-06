"use client";

import { ReactNode } from "react";
// layouts
import { ProjectWrapper } from "@/layouts/auth-layout";

const ProjectDetailLayout = ({ children }: { children: ReactNode }) => (
  <ProjectWrapper>{children}</ProjectWrapper>
);

export default ProjectDetailLayout;
