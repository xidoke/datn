import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { State, Label } from "@/types";

export interface Issue {
  id: string;
  title: string;
  description: string;
  state: State;
  labels: Label[];
  assignee?: string;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

interface IssueStore {
  issues: Issue[];
  isLoading: boolean;
  fetchIssues: (projectId: string) => Promise<void>;
  addIssue: (
    issue: Omit<Issue, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
}

const sampleIssues: Issue[] = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Set up user authentication system using JWT",
    state: { id: "2", name: "Todo", color: "#3b82f6", group: "unstarted" },
    labels: [{ id: "1", name: "Feature", color: "#4bce97" }],
    priority: "high",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Design landing page",
    description: "Create a responsive design for the landing page",
    state: { id: "3", name: "In Progress", color: "#eab308", group: "started" },
    labels: [{ id: "2", name: "Design", color: "#62b0fd" }],
    priority: "medium",
    createdAt: "2023-06-02T09:00:00Z",
    updatedAt: "2023-06-02T14:00:00Z",
  },
  // Add more sample issues as needed
];

export const useIssueStore = create<IssueStore>()(
  devtools(
    persist(
      (set, get) => ({
        issues: [],
        isLoading: false,

        fetchIssues: async (projectId: string) => {
          set({ isLoading: true });
          try {
            // Simulating API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set({ issues: sampleIssues });
          } catch (error) {
            console.error("Failed to fetch issues:", error);
          } finally {
            set({ isLoading: false });
          }
        },

        addIssue: async (issue) => {
          const newIssue: Issue = {
            ...issue,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({ issues: [...state.issues, newIssue] }));
          // Simulating API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
        },

        updateIssue: async (id, updates) => {
          set((state) => ({
            issues: state.issues.map((issue) =>
              issue.id === id
                ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
                : issue,
            ),
          }));
          // Simulating API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
        },

        deleteIssue: async (id) => {
          set((state) => ({
            issues: state.issues.filter((issue) => issue.id !== id),
          }));
          // Simulating API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
        },
      }),
      {
        name: "issue-storage",
      },
    ),
  ),
);
