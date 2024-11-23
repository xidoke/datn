import { Project } from "@/types";
import { LayoutSelection } from "./issue-layouts/filter/layout-selection";
import { IssueLayoutTypes } from "@/helpers/constants/issue";
import { useState } from "react";

type Props = {
  currentProjectDetails: Project | undefined;
};

const HeaderFilters = ({ currentProjectDetails }: Props) => {
  const [activeLayout] = useState(IssueLayoutTypes.LIST);
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
        onChange={(layout) => console.log(layout)}
        selectedLayout={activeLayout}
      />
    </>
  );
};

export default HeaderFilters;
