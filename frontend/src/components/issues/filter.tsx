import { Project } from "@/types";
import { LayoutSelection } from "./issue-layouts/filter/layout-selection";
import { IssueLayoutTypes } from "@/helpers/constants/issue";
import { useState } from "react";
import { useViewStore } from "@/stores/viewStore";
import { Input } from "../ui/input";
import { useFilterStore } from "@/stores/filterStore";
import { Search } from "lucide-react";
import FilterAllDropdown from "../dropdown/filterAll";

type Props = {
  currentProjectDetails: Project | undefined;
};

const HeaderFilters = ({ currentProjectDetails }: Props) => {
  const { viewType, setViewType } = useViewStore();
  const { search, setFilter } = useFilterStore();
  return (
    <>
      <FilterAllDropdown />
      <div className="relative hidden md:block">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          className="h-8 w-24 rounded-md px-3 pl-8 text-xs transition duration-1000 focus:w-32 focus:duration-1000"
          placeholder="search..."
          value={search}
          onChange={(e) => setFilter({ search: e.target.value })}
        />
      </div>

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
