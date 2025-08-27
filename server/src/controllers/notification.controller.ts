import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { z } from 'zod';
import { requireAuth } from '../middlewares/auth';

const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
  target: z.enum(['ALL', 'YOUTHS', 'EMPLOYERS'] as const),
  scheduledFor: z.string().datetime().optional(),
});

export const notificationController = {
  createNotification: [
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const parse = createNotificationSchema.safeParse(req.body);
        if (!parse.success) {
          return res.status(400).json({ error: parse.error.flatten() });
        }

        const notification = await notificationService.createNotification({
          ...parse.data,
          scheduledFor: parse.data.scheduledFor ? new Date(parse.data.scheduledFor) : undefined,
          createdById: req.auth?.userId,
        });

        res.status(201).json(notification);
      } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
      }
    },
  ],

  getUserNotifications: [
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const limit = parseInt(req.query.limit as string) || 20;
        const cursor = req.query.cursor as string | undefined;
        
        const result = await notificationService.getUserNotifications(
          req.auth!.userId,
          limit,
          cursor
        );

        res.json(result);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }
    },
  ],

  markAsRead: [
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { notificationId } = req.params;
        await notificationService.markAsRead(req.auth!.userId, notificationId);
        res.status(204).send();
      } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
      }
    },
  ],

  markAllAsRead: [
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        await notificationService.markAllAsRead(req.auth!.userId);
        res.status(204).send();
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
      }
    },
  ],

  getUnreadCount: [
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const count = await notificationService.getUnreadCount(req.auth!.userId);
        res.json({ count });
      } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ error: 'Failed to get unread count' });
      }
    },
  ],
};
