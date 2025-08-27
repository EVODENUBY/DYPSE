import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'employers' | 'youths';
  scheduledFor: Date;
  createdAt: Date;
  status: 'sent' | 'scheduled' | 'draft';
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_STORAGE_KEY = 'dysem_notifications';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects and ensure read property exists
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          scheduledFor: new Date(n.scheduledFor),
          createdAt: new Date(n.createdAt),
          read: n.read || false, // Ensure read property exists
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Failed to parse saved notifications', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'status' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'sent',
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Only show snackbar for relevant users
    if (!user || 
        notification.target === 'all' || 
        (user.role === 'youth' && notification.target === 'youths') ||
        (user.role === 'employer' && notification.target === 'employers')) {
      setLatestNotification(newNotification);
      setShowSnackbar(true);
      
      // Auto-hide snackbar after 5 seconds
      const timer = setTimeout(() => setShowSnackbar(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Filter notifications based on user role and sort by date (newest first)
  const filteredNotifications = React.useMemo(() => {
    if (!user) return [];
    
    return notifications
      .filter(notification => {
        // For admin, show all notifications
        if (user.role === 'admin') return true;
        
        // For other users, filter by target
        return (
          notification.target === 'all' || 
          (user.role === 'youth' && notification.target === 'youths') ||
          (user.role === 'employer' && notification.target === 'employers')
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, user]);

  // Calculate unread count for current user
  const unreadCount = React.useMemo(() => {
    return filteredNotifications.filter(n => !n.read).length;
  }, [filteredNotifications]);

  // Mark notifications as read when they become visible
  useEffect(() => {
    if (filteredNotifications.some(n => !n.read)) {
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 3000); // Mark as read after 3 seconds of being visible
      
      return () => clearTimeout(timer);
    }
  }, [filteredNotifications, markAllAsRead]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: filteredNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
      {showSnackbar && latestNotification && (
        <div 
          className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg max-w-md z-50"
          onClick={() => setShowSnackbar(false)}
        >
          <div className="font-bold">{latestNotification.title}</div>
          <div>{latestNotification.message}</div>
          <div className="text-xs opacity-75 mt-1">
            {new Date(latestNotification.createdAt).toLocaleString()}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
