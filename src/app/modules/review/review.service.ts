import { Review } from '@prisma/client';
import prisma from '../../../shared/prisma';

const postReview = async (data: Review): Promise<Review> => {
  const result = await prisma.review.create({
    data,
    include: {
      user: true,
      service: true,
    },
  });
  return result;
};
const getAllReview = async (): Promise<Review[] | any> => {
  const result = await prisma.review.findMany({
    include: {
      user: true,
    },
  });
  return {
    data: result,
  };
};

const getReviewByServiceId = async (id: string): Promise<Review[] | null> => {
  console.log('Hitted');
  const result = await prisma.review.findMany({
    where: {
      serviceId: id,
    },
    include: {
      user: true,
    },
  });
  return result;
};
export const ReviewServices = {
  postReview,
  getAllReview,
  getReviewByServiceId,
};
