// @typescript-eslint/no-unused-vars
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { paymentSearchableFields } from './payment.constants';
import { queryHelpers } from '../../../helpers/queryHelpers';
import { sslService } from '../ssl/ssl.service';

import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const initPayment = async (data: any) => {   
  function generateSixDigitId() {
    const timestamp = Date.now();
    const sixDigitId = timestamp % 1000000;
    const sixDigitIdString = sixDigitId.toString().padStart(6, '0');
    return sixDigitIdString;
  }

  const transactionId = generateSixDigitId();

  console.log(data,'22');
  const paymentSession = await sslService.initPayment({
    total_amount: data.amount,
    tran_id: transactionId,
    cus_name: data.name,
    cus_email: data.email,
    cus_add1: data.address,
    cus_phone: data.phone,
  });

  const pdata = await prisma.payment.create({
    data: {
      amount: data.amount,
      transactionId: transactionId,
      userId: data.userId,
      bookingId: data.bookingId,
    },
  });
  console.log(pdata);
  return paymentSession.redirectGatewayURL;
  // return pdata;
};

// const paymentVerify = async (id: any) => {
//   const result = await prisma.payment.updateMany({
//     where: {
//       transactionId: id,
//     },
//     data: {
//       status: PaymentStatus.PAID,
//     },
//   });

//   // Return the result or use it in the calling function
//   return result;
// };

const paymentVerify = async (id: any): Promise<any> => {
  console.log(id,'ssss');
  const isPaymentExist = await prisma.payment.findFirst({
    where: {
      transactionId: id,
    },
  });

  if (!isPaymentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment does not exist');
  }
  const result = await prisma.$transaction(async transactionClient => {
    // Update payment status to PAID
    const updatedPayments = await transactionClient.payment.updateMany({
      where: {
        transactionId: id,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    if (updatedPayments) {
      await transactionClient.booking.update({
        where: {
          id: isPaymentExist?.bookingId,
        },
        data: {
          isPaid: true,
        },
      });
    }

    return updatedPayments;
  });
  return result;
};
const webhook = async (payload: any) => {
  if (!payload || !payload?.status || payload?.status !== 'VALID') {
    return {
      massage: 'Invalid Payment!',
    };
  }
  const result = await sslService.validate(payload);

  if (result?.status !== 'VALID') {
    return {
      massage: 'Payment failed',
    };
  }

  const { tran_id } = result;
  await prisma.payment.updateMany({
    where: {
      transactionId: tran_id,
    },
    data: {
      status: PaymentStatus.PAID,
      paymentGatewayData: payload,
    },
  });

  return {
    massage: 'Payment Success',
  };
};

const getAllFromDB = async (
  filters: any,
  options: any
): Promise<IGenericResponse<Payment[]>> => {
  const { limit, page, skip } = queryHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: paymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.payment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteFromDB = async (id: string): Promise<Payment | null> => {
  const result = await prisma.payment.delete({
    where: {
      id,
    },
  });
  return result;
};

export const PaymentService = {
  initPayment,
  webhook,
  getAllFromDB,
  deleteFromDB,
  paymentVerify,
};
