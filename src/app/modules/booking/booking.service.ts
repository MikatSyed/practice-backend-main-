import { Booking } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Booking): Promise<Booking> => {
  console.log(data);
  const { userId, serviceId, slotId, bookingDate } = data;
  // Create the booking if it doesn't already exist
  const existingBooking = await prisma.booking.findFirst({
    where: {
      slotId,
      serviceId,
      bookingDate,
    },
  });

  if (existingBooking) {
    // The slot is already booked for this date and service
    throw new Error('Slot is not available for this date and service.');
  }

  const result = await prisma.booking.create({
    data: {
      bookingDate,
      userId,
      serviceId,
      slotId,
      // Other fields...
    },
  });
  return result;
};

const fetchBookingsForDate = async (
  bookingDate: string
): Promise<Booking[] | null | undefined> => {
  console.log('s', bookingDate);
  if (bookingDate) {
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate,
      },
    });
    console.log(bookings);
    return bookings;
  }
};

const getAllFromDB = async (): Promise<Booking[]> => {
  const result = await prisma.booking.findMany({
    include: {
      user: true, // Include the User relation
      service: true, // Include the Service relation
      slot: true, // Include the TimeSlots relation
      // Include the Payment relation
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getByIdFromDB = async (id: string): Promise<Booking | null> => {
  const isBookingExist = await prisma.booking.findFirst({
    where: {
      id,
    },
  });

  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not exist');
  }

  const result = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      user: true, // Include the User relation
      service: true, // Include the Service relation
      slot: true, // Include the TimeSlots relation
      // Include the Payment relation
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Booking>
): Promise<Booking> => {
  const isBookingExist = await prisma.booking.findFirst({
    where: {
      id,
    },
  });

  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not exist');
  }

  const result = await prisma.booking.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// const deleteByIdFromDB = async (id: string): Promise<Booking> => {
//   const isBookingExist = await prisma.booking.findFirst({
//     where: {
//       id,
//     },
//   });

//   if (!isBookingExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not exist');
//   }

//   const data = await prisma.booking.delete({
//     where: {
//       id,
//     },
//   });
//   return data;
// };

const deleteByIdFromDB = async (id: string): Promise<Booking> => {
  const isBookingExist = await prisma.booking.findFirst({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async transactionClient => {
    await transactionClient.payment.deleteMany({
      where: {
        bookingId: isBookingExist?.id,
      },
    });

    const data = await transactionClient.booking.delete({
      where: {
        id,
      },
    });
    return data;
  });
  return result;
};

const getStatistics = async () => {
  console.log('hitted');
  const totalUsers = await prisma.user.count();
  const totalBookings = await prisma.booking.count();
  const totalServices = await prisma.service.count();

  const data = {
    totalBookings,
    totalServices,
    totalUsers,
  };
  return data;
};

export const BookingService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  fetchBookingsForDate,
  getStatistics,
};
