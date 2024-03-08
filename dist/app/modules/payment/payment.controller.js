"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const http_status_1 = __importDefault(require("http-status"));
const payment_constants_1 = require("./payment.constants");
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const initPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.initPayment(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payment init successfully',
        data: result,
    });
});
const paymentVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    const result = yield payment_service_1.PaymentService.paymentVerify(transactionId);
    console.log(result === null || result === void 0 ? void 0 : result.transactionId, 'aaaaa');
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
        res.redirect(`https://home-crafter-mikatsyed.vercel.app/success?transactionId=${result === null || result === void 0 ? void 0 : result.transactionId}`);
    }
    else {
        // Handle the case where the update failed
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Payment verification failed',
        });
    }
});
const webhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.webhook(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payment verified!',
        data: result,
    });
});
const getAllFromDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, payment_constants_1.paymentFilterableFields);
        const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
        const result = yield payment_service_1.PaymentService.getAllFromDB(filters, options);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payments fetched successfully',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteFromDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield payment_service_1.PaymentService.deleteFromDB(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Payment delete successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.PaymentController = {
    initPayment,
    paymentVerify,
    webhook,
    getAllFromDB,
    deleteFromDB,
};
