import useSWR from "swr";
import { useNotificationStore } from "@/store/notificationStore";
import { useCallback, useEffect } from "react";
import { INotification } from "@/types/notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetcher = async (url: string): Promise<INotification[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the notifications.",
    );
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useNotifications() {
  const {
    data: notifications,
    error,
    isLoading,
    mutate,
  } = useSWR<INotification[]>(`${API_BASE_URL}/api/notifications`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  useEffect(() => {
    if (notifications) setNotifications(notifications);
  }, [notifications, setNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/notifications/${notificationId}/read`,
          {
            method: "PUT",
          },
        );
        if (!response.ok)
          throw new Error("Failed to mark notification as read");
        mutate(
          (currentNotifications) =>
            currentNotifications?.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n,
            ) || [],
          false,
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    [mutate],
  );

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/notifications/${notificationId}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete notification");
        mutate(
          (currentNotifications) =>
            currentNotifications?.filter((n) => n.id !== notificationId) || [],
          false,
        );
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    [mutate],
  );

  return {
    notifications: notifications || [],
    isLoading,
    isError: !!error,
    error,
    markAsRead,
    deleteNotification,
    mutate,
  };
}
