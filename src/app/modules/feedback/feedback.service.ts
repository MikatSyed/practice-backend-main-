import { Feedback } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createFeedBack = async (data: Feedback): Promise<Feedback> => {
  const result = await prisma.feedback.create({
    data,
  });

  return result;
};

export const FeedBackService = {
  createFeedBack,
};
