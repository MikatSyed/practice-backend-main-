// @typescript-eslint/no-unused-vars
import { NextFunction, Request, Response } from 'express';
import { PaymentService } from './payment.service';
import httpStatus from 'http-status';
import { paymentFilterableFields } from './payment.constants';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';

const initPayment = async (req: Request, res: Response) => {
  const result = await PaymentService.initPayment(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment init successfully',
    data: result,
  });
};

const paymentVerify = async (req: Request, res: Response) => {

  const  id  = req.query;
  let {transectionId} = id;
  

  const result = await PaymentService.paymentVerify(transectionId);
  console.log(result, 'aaaaa');
  // Check if the update was successful
  if (result && result.count > 0) {
    // Send a success response
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: 'Payment verified!',
    //   data: result,
    // });

    // Redirect after sending the response
    res.redirect(
      `http://localhost:3000/success?transactionId=${transectionId}`
    );
  } else {
    // Handle the case where the update failed
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Payment verification failed',
    });
  }
};

const webhook = async (req: Request, res: Response) => {
  const result = await PaymentService.webhook(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment verified!',
    data: result,
  });
};

const getAllFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, paymentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PaymentService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await PaymentService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment delete successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const PaymentController = {
  initPayment,
  paymentVerify,
  webhook,
  getAllFromDB,
  deleteFromDB,
};
