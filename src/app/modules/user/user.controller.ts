import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.getAllFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully !',
    data: result,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched successfully!',
    data: result,
  });
});

const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateOneInDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully!',
    data: result,
  });
});

const deleteByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
