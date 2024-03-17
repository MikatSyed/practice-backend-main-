import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { ReviewServices } from './review.service';
import catchAsync from '../../../shared/catchAsync';
import { RequestHandler } from 'express';

const postReview: RequestHandler = catchAsync(async (req, res) => {
  const result = await ReviewServices.postReview(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review post successfully',
    data: result,
  });
});

const getAllReview: RequestHandler = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review post successfully',
    data: result,
  });
});
const getReviewByServiceId: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewServices.getReviewByServiceId(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrived successfully',
    data: result,
  });
});

export const ReviewController = {
  postReview,
  getAllReview,
  getReviewByServiceId,
};
