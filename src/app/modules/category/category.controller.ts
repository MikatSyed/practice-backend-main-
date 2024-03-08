import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';
import { queryFields } from '../services/service.constant';
import pick from '../../../shared/pick';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, queryFields);
  const result = await CategoryService.getAllFromDB(queryOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category fetched successfully',
    data: result,
  });
});

const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.updateOneInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
