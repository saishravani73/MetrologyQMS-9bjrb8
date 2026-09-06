import { useState } from 'react';
import { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getByType = (type: Notification['type']) => notifications.filter((n) => n.type === type);

  return { notifications, unreadCount, markAsRead, markAllAsRead, getByType };
}
