import { IssueLayoutTypes } from '@/helpers/constants/issue';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// view type store

interface ViewStoreState {
    viewType: IssueLayoutTypes;
}

const initialState: ViewStoreState = {
    viewType: IssueLayoutTypes.KANBAN,
};

interface ViewStoreActions {
    setViewType: (view: IssueLayoutTypes) => void;
    reset: () => void;
}

type ViewStore = ViewStoreState & ViewStoreActions;

export const useViewStore = create<ViewStore, [['zustand/persist', ViewStore]]>(
    persist(
        (set) => ({
            ...initialState,
            setViewType: (view: IssueLayoutTypes) => set({ viewType: view }),
            reset: () => set(initialState),
        }),
        {
            name: 'view-store', // unique name for the storage
        }
    )
);