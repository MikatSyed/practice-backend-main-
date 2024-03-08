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
exports.FaqController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const faq_service_1 = require("./faq.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_service_1.faqService.insertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faq created successfully',
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_service_1.faqService.getAllFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faqs fetched successfully',
        data: result,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield faq_service_1.faqService.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faqs fetched successfully',
        data: result,
    });
}));
const updateOneInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield faq_service_1.faqService.updateOneInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faqs updated successfully',
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield faq_service_1.faqService.deleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faqs deleted successfully',
        data: result,
    });
}));
exports.FaqController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
