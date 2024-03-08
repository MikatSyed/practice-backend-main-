import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { ServiceFilterableFields, queryFields } from './service.constant';
import httpStatus from 'http-status';
import { ServiceServices } from './service.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await ServiceServices.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, ServiceFilterableFields);
  console.log({ filters });

  const queryOptions = pick(req.query, queryFields);
  console.log(queryOptions);

  const result = await ServiceServices.getAllFromDB(filters, queryOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    data: result,
  });
});
const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.updateOneInDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const ServiceController = {
  insertIntoDB,
  getAllFromDB,
  // getByCategoryIdFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
