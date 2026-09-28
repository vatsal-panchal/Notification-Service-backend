import { Router } from 'express';
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createNotification);
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

export default router;
