import {create} from 'zustand';
type Attachment = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  fileName: string;
};
interface AttachmentState {
  attachments: Attachment[];
  isLoading: boolean;
  error: string | null;
  fetchAttachments: (issueId: string) => Promise<void>;
  addAttachment: (issueId: string, file: File) => Promise<void>;
  removeAttachment: (attachmentId: string) => Promise<void>;
}

const useAttachmentStore = create<AttachmentState>((set, get) => ({
  attachments: [],
  isLoading: false,
  error: null,
  fetchAttachments: async (issueId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/issues/${issueId}/attachments`);
      const data = await response.json();
      set({ attachments: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch attachments', isLoading: false });
    }
  },
  addAttachment: async (issueId, file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`/api/issues/${issueId}/attachments`, {
        method: 'POST',
        body: formData,
      });
      const newAttachment = await response.json();
      set((state) => ({
        attachments: [...state.attachments, newAttachment],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add attachment', isLoading: false });
    }
  },
  removeAttachment: async (attachmentId) => {
    set({ isLoading: true, error: null });
    try {
      await fetch(`/api/attachments/${attachmentId}`, { method: 'DELETE' });
      set((state) => ({
        attachments: state.attachments.filter((a) => a.id !== attachmentId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to remove attachment', isLoading: false });
    }
  },
}));

export default useAttachmentStore;