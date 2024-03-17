import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingService.getAllFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking fetched successfully',
    data: result,
  });
});

const fetchBookingsForDate: RequestHandler = catchAsync(async (req, res) => {
  const bookingDate = req.query.bookingDate as any;
  // console.log('c',bookingDate)
  const result = await BookingService.fetchBookingsForDate(bookingDate);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Available Time fetched successfully',
    data: result,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking fetched successfully',
    data: result,
  });
});

const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingService.updateOneInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});

const deleteByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingService.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});

const getStatistics: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingService.getStatistics();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Statistic fetched successfully',
    data: result,
  });
});

export const BookingController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  fetchBookingsForDate,
  getStatistics,
};
