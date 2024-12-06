import { IssueLayoutTypes } from '@/helpers/constants/issue';
import {create} from 'zustand';
// view type store

interface ViewStoreState {
    viewType : IssueLayoutTypes
}

const initialState : ViewStoreState = {
    viewType : IssueLayoutTypes.KANBAN,
}

interface ViewStoreActions {
    setViewType: (view: IssueLayoutTypes) => void
}

type ViewStore = ViewStoreState & ViewStoreActions;

export const useViewStore = create<ViewStore>((set) => ({
    ...initialState,
    setViewType: (view: IssueLayoutTypes) => set({ viewType: view }),
}));