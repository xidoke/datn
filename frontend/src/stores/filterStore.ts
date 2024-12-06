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
    resetFilter: () => void;
}

type FilterStore = FilterStoreState & FilterStoreActions;

export const filterStore = create<FilterStore>((set) => ({
    ...initialState,
    setFilter: (filter: Partial<FilterStoreState>) => set(filter),
    resetFilter: () => set(initialState),
}));