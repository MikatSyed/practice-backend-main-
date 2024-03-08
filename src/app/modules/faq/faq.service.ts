import { Faq } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Faq): Promise<Faq> => {
  const result = await prisma.faq.create({ data });
  return result;
};

const getAllFromDB = async (): Promise<Faq[]> => {
  const result = await prisma.faq.findMany({});
  return result;
};

const getByIdFromDB = async (id: string): Promise<Faq | null> => {
  const isfaqExist = await prisma.faq.findFirst({
    where: {
      id,
    },
  });

  if (!isfaqExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'faq does not exist');
  }

  const result = await prisma.faq.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Faq>
): Promise<Faq> => {
  const isfaqExist = await prisma.faq.findFirst({
    where: {
      id,
    },
  });

  if (!isfaqExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'faq does not exist');
  }

  const result = await prisma.faq.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Faq> => {
  const isfaqExist = await prisma.faq.findFirst({
    where: {
      id,
    },
  });

  if (!isfaqExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'faq does not exist');
  }

  const data = await prisma.faq.delete({
    where: {
      id,
    },
  });
  return data;
};

export const faqService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
