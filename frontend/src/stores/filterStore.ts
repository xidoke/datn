// filter for issues in each project

import { create } from "zustand";

interface FilterStoreState {
    priorityNumber: number[]
    statusIds: string[];
    assigneeIds: string[];
    cycleIds: string[];
    labelIds: string[];
}

const initialState: FilterStoreState = {
    priorityNumber: [],
    statusIds: [],
    assigneeIds: [],
    cycleIds: [],
    labelIds: [],
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