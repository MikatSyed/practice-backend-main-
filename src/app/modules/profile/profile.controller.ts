import { RequestHandler } from 'express';
import { ProfileService } from './profile.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';

const getUserProfile: RequestHandler = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const result = await ProfileService.getUserProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

export const ProfileController = {
  getUserProfile,
};
