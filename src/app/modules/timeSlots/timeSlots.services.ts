import { TimeSlots } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createTimeSlot = async (data: TimeSlots): Promise<TimeSlots> => {
  const existingTimeSlot = await prisma.timeSlots.findFirst({
    where: { startTime: data.startTime },
  });

  if (existingTimeSlot) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'A time slot with the same startTime already exists.'
    );
  }

  const result = await prisma.timeSlots.create({
    data,
  });

  return result;
};

const getAllTimeSlots = async (): Promise<TimeSlots[] | any> => {
  const result = await prisma.timeSlots.findMany();
  const total = await prisma.timeSlots.count();
  return {
    meta: {
      total,
    },
    data: result,
  };
};

const getSingleTimeSlot = async (id: string): Promise<TimeSlots | null> => {
  const result = await prisma.timeSlots.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

const updateTimeSlot = async (
  id: string,
  timeSlot: TimeSlots
): Promise<TimeSlots> => {
  const result = await prisma.timeSlots.update({
    where: {
      id: id,
    },
    data: timeSlot,
  });
  return result;
};

const deleteTimeSlot = async (id: string): Promise<TimeSlots> => {
  const existingTimeSlot = await prisma.timeSlots.findFirst({
    where: {
      id,
    },
  });

  if (!existingTimeSlot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Slot does not exist');
  }

  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.booking.deleteMany({
      where: {
        slotId: existingTimeSlot?.id,
      },
    });

    const data = await transactionClient.timeSlots.delete({
      where: {
        id,
      },
    });
    return data;
  });
  return result;
};

export const timeSlotsServices = {
  createTimeSlot,
  getAllTimeSlots,
  getSingleTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
};
