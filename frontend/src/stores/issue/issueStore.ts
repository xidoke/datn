import { create } from "zustand";
import { coreIssueSlice, CoreIssueSlice } from "./slices/coreSlice";

export type IssueStore = CoreIssueSlice;


export const useIssueStore = create<IssueStore>()((...a) => ({
    ...coreIssueSlice(...a),
    }));
