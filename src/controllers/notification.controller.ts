import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';

export const createNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, message, type } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Notification title is required',
      });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Notification message is required',
      });
      return;
    }

    if (!type || !['EMAIL', 'IN_APP'].includes(type)) {
      res.status(400).json({
        success: false,
        message: 'Notification type must be EMAIL or IN_APP',
      });
      return;
    }

    const notification = await Notification.create({
      user: req.user!._id,
      title: title.trim(),
      message: message.trim(),
      type,
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notifications = await Notification.find({ user: req.user!._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID',
      });
      return;
    }

    const notification = await Notification.findOne({
      _id: id,
      user: req.user!._id,
    });

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification retrieved successfully',
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID',
      });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user!._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID',
      });
      return;
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user!._id,
    });

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
