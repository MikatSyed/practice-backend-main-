import { NextFunction, Request, Response } from 'express';
import { FeedBackService } from './feedback.service';

const createFeedBack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ...timeSlotData } = req.body;
    const timeSlot = await FeedBackService.createFeedBack(timeSlotData);
    res.status(200).json({
      status: 'success',
      message: 'FeedBack posted successfully',
      data: timeSlot,
    });
  } catch (error) {
    next(error);
  }
};

export const FeedbackController = {
  createFeedBack,
};
