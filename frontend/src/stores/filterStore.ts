// filter for issues in each project

import { TIssuePriorities } from "@/types";
import { create } from "zustand";

interface FilterStoreState {
     priorityIds: TIssuePriorities[];
    statusIds: string[];
    assigneeIds: string[];
    cycleIds: string[];
    labelIds: string[];
    startDate: string;
    dueDate: string;
}

const initialState: FilterStoreState = {
    priorityIds: [],
    statusIds: [],
    assigneeIds: [],
    cycleIds: [],
    labelIds: [],
    startDate: "",
    dueDate: "",
};

interface FilterStoreActions {
    setFilter: (filter: Partial<FilterStoreState>) => void;
    reset: () => void;
}

type FilterStore = FilterStoreState & FilterStoreActions;

export const useFilterStore = create<FilterStore>((set) => ({
    ...initialState,
    setFilter: (filter: Partial<FilterStoreState>) => set(filter),
    reset: () => set(initialState),
}));