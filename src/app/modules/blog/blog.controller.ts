import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogService.getAllFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs fetched successfully',
    data: result,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs fetched successfully',
    data: result,
  });
});

const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogService.updateOneInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs updated successfully',
    data: result,
  });
});

const deleteByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogService.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs deleted successfully',
    data: result,
  });
});

export const BlogController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
