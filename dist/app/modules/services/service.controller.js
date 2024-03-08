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
exports.ServiceController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const service_constant_1 = require("./service.constant");
const http_status_1 = __importDefault(require("http-status"));
const service_service_1 = require("./service.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_service_1.ServiceServices.insertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service created successfully',
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, service_constant_1.ServiceFilterableFields);
    console.log({ filters });
    const queryOptions = (0, pick_1.default)(req.query, service_constant_1.queryFields);
    console.log(queryOptions);
    const result = yield service_service_1.ServiceServices.getAllFromDB(filters, queryOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield service_service_1.ServiceServices.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service fetched successfully',
        data: result,
    });
}));
const updateOneInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield service_service_1.ServiceServices.updateOneInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service updated successfully',
        data: result,
    });
}));
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield service_service_1.ServiceServices.deleteByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service deleted successfully',
        data: result,
    });
}));
exports.ServiceController = {
    insertIntoDB,
    getAllFromDB,
    // getByCategoryIdFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
