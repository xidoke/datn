import { Project } from "@/types";
import { LayoutSelection } from "./issue-layouts/filter/layout-selection";
import { IssueLayoutTypes } from "@/helpers/constants/issue";
import { useState } from "react";
import { useViewStore } from "@/stores/viewStore";

type Props = {
  currentProjectDetails: Project | undefined;
};

const HeaderFilters = ({ currentProjectDetails }: Props) => {
  const { viewType, setViewType } = useViewStore();
  return (
    <>
      <LayoutSelection
        layouts={[
          IssueLayoutTypes.LIST,
          IssueLayoutTypes.KANBAN,
          IssueLayoutTypes.CALENDAR,
          IssueLayoutTypes.SPREADSHEET,
          IssueLayoutTypes.GANTT,
        ]}
        onChange={(layout) => setViewType(layout)}
        selectedLayout={viewType}
      />
    </>
  );
};

export default HeaderFilters;
