export interface INotification {
  id: string;
  type: "ISSUE_ASSIGNED" | "COMMENT_ADDED" | "ISSUE_UPDATED" | "MENTION";
  content: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationState {
  notifications: INotification[];
  setNotifications: (notifications: INotification[]) => void;
  addNotification: (notification: INotification) => void;
  markAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
}
