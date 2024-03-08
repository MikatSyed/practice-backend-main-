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
exports.BookingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const booking_service_1 = require("./booking.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingService.insertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingService.getAllFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking fetched successfully',
        data: result,
    });
}));
const fetchBookingsForDate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDate = req.query.bookingDate;
    // console.log('c',bookingDate)
    const result = yield booking_service_1.BookingService.fetchBookingsForDate(bookingDate);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Available Time fetched successfully',
        data: result,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_service_1.BookingService.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking fetched successfully',
        data: result,
    });
}));
const updateOneInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_service_1.BookingService.updateOneInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking updated successfully',
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_service_1.BookingService.deleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking deleted successfully',
        data: result,
    });
}));
const getStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingService.getStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Statistic fetched successfully',
        data: result,
    });
}));
exports.BookingController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    fetchBookingsForDate,
    getStatistics,
};
