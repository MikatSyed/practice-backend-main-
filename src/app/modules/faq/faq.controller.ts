import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { faqService } from './faq.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await faqService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq created successfully',
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await faqService.getAllFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs fetched successfully',
    data: result,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await faqService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs fetched successfully',
    data: result,
  });
});

const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await faqService.updateOneInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs updated successfully',
    data: result,
  });
});

const deleteByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await faqService.deleteByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs deleted successfully',
    data: result,
  });
});

export const FaqController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
