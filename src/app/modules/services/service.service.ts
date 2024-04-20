// @typescript-eslint/no-explicit-any
import { Availbility, Service } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { queryHelpers } from '../../../helpers/queryHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  ServiceRelationalFields,
  ServiceRelationalFieldsMapper,
  ServiceSearchableFields,
} from './service.constant';
import { IServiceFilters } from './service.interface';
import cloudinary from 'cloudinary';

const insertIntoDB = async (data: Service): Promise<Service> => {
  const {
    price,
    categoryId,
    duration,
    description,
    location,
    availbility,
    name,
  } = data;
  let { serviceImg } = data;
  console.log(serviceImg, 'ggg');

  const isNameExist = await prisma.user.findFirst({
    where: {
      name,
    },
  });

  if (isNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already exits');
  }

  if (serviceImg) {
    let images: any = [];
    if (typeof serviceImg === 'string') {
      images.push(serviceImg);
    } else {
      images = serviceImg;
    }
    if (!serviceImg) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please Select Image');
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'services',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    serviceImg = imagesLinks.map(image => image.url);
  }

  const result = await prisma.service.create({
    data: {
      name,
      price,
      categoryId,
      duration,
      description,
      location,
      serviceImg,
      availbility,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IServiceFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { limit, page, skip } = queryHelpers.calculatePagination(options);
  const { searchTerm, minPrice, maxPrice, ...filterData } = filters;
  let newMinPrice;
  let newMaxPrice;
  if (typeof minPrice === 'string') {
    newMinPrice = parseInt(minPrice);
  }

  if (typeof maxPrice === 'string') {
    newMaxPrice = parseInt(maxPrice);
  }

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        ...ServiceSearchableFields.map(field => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
        {
          category: {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    });
  }

  if (newMinPrice && newMaxPrice) {
    andConditions.push({
      price: {
        gte: newMinPrice,
        lte: newMaxPrice,
      },
    });
  } else if (newMinPrice) {
    andConditions.push({
      price: {
        gte: newMinPrice,
      },
    });
  } else if (newMaxPrice) {
    andConditions.push({
      price: {
        lte: newMaxPrice,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (ServiceRelationalFields.includes(key)) {
          return {
            [ServiceRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    include: {
      category: true,
      reviews: true,
    },
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
  const total = await prisma.service.count({
    where: whereConditions,
  });

  const servicesWithStatistics = result.map(service => {
    const reviews = service.reviews;
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    return {
      ...service,
      totalReviews,
      averageRating,
    };
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: servicesWithStatistics,
  };
};


const getOverview = async (): Promise<any> => {
  // Fetch total number of services
  const totalServices = await prisma.service.count();

  // Fetch total number of bookings
  const totalBookings = await prisma.booking.count();

  // Fetch total earnings (sum of payment table amount)
  const earningsData = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    _count: true,
  });
  const totalEarnings = {
    amount: earningsData._sum.amount || 0,
    totalPayment: earningsData._count || 0,
  };



  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const payments = await prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
          createdAt: {
              gte: sevenDaysAgo,
          },
      },
      _sum: {
          amount: true,
      },
  });
  
  const sumByDay: any = {};
  
  payments.forEach((payment: any) => {
      const day = new Date(payment.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (sumByDay[day]) {
          sumByDay[day] += payment._sum.amount;
      } else {
          sumByDay[day] = payment._sum.amount;
      }
  });
  
  // Fill in missing days with zero earnings
  const formattedRevenueData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
      name: day,
      earning: sumByDay[day] || 0,
  }));

  const categoryServiceCounts = await prisma.category.findMany({
    select: {
      title: true,
      _count: {
        select: {
          services: true,
        },
      },
    },
  });
  
  const formattedCategoryServiceCounts = categoryServiceCounts.map(category => ({
    name: category.title,
    totalServices: category._count.services,
  }));

  // Fetch total number of providers (users with role "provider")
  const totalProviders = await prisma.user.count({
    where: {
      role: 'admin',
    },
  });

  return {
    
    totalBookings,
    totalEarnings,
    formattedRevenueData,
    formattedCategoryServiceCounts,
    totalServices: {
      service: totalServices,
      provider: totalProviders,
    },
  };
};




const getByIdFromDB = async (id: string): Promise<Service | null> => {
  const isserviceExist = await prisma.service.findFirst({
    where: {
      id,
    },
  });

  if (!isserviceExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'service does not exist');
  }

  const result = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      reviews: true,
      bookings: true,
    },
  });

  if (result) {
    if (result?.reviews && result.reviews.length > 0) {
      const totalReviews = result.reviews.length;

      // Calculate average rating
      const sumOfRatings = result.reviews.reduce(
        (sum: number, review: any) => sum + (review.rating || 0),
        0
      );
      const averageRating = sumOfRatings / totalReviews;

      // Add the calculated values to the result object
      result.averageRating = averageRating;
      result.totalReviews = totalReviews;
    } else {
      // If there are no reviews, set default values
      result.averageRating = null;
      result.totalReviews = null;
    }
  }

  return result;
};
const updateOneInDB = async (
  id: string,
  payload: Partial<Service>
): Promise<Service> => {
  const isserviceExist = await prisma.service.findFirst({
    where: {
      id,
    },
  });

  console.log(isserviceExist);

  if (!isserviceExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'service does not exist');
  }

  if (
    payload.availbility &&
    isserviceExist.availbility === Availbility.available &&
    payload.availbility === Availbility.upcoming
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'can only change from upcoming to available'
    );
  }

  const result = await prisma.service.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Service> => {
  let result: Service;

  await prisma.$transaction(async transaction => {
    const isserviceExist = await transaction.service.findFirst({
      where: {
        id,
      },
      include: {
        bookings: true, // Include bookings relation
      },
    });

    if (!isserviceExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'service does not exist');
    }

    // Delete bookings associated with the service
    await transaction.booking.deleteMany({
      where: {
        serviceId: id,
      },
    });

    // Delete reviews associated with the service
    await transaction.review.deleteMany({
      where: {
        serviceId: id,
      },
    });

    // Delete the service
    result = await transaction.service.delete({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  });

  return result!;
};

export const ServiceServices = {
  insertIntoDB,
  getAllFromDB,
  // getByCategoryIdFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getOverview
};
