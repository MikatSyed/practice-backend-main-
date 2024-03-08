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
exports.faqService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.faq.create({ data });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.faq.findMany({});
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isfaqExist = yield prisma_1.default.faq.findFirst({
        where: {
            id,
        },
    });
    if (!isfaqExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'faq does not exist');
    }
    const result = yield prisma_1.default.faq.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isfaqExist = yield prisma_1.default.faq.findFirst({
        where: {
            id,
        },
    });
    if (!isfaqExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'faq does not exist');
    }
    const result = yield prisma_1.default.faq.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isfaqExist = yield prisma_1.default.faq.findFirst({
        where: {
            id,
        },
    });
    if (!isfaqExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'faq does not exist');
    }
    const data = yield prisma_1.default.faq.delete({
        where: {
            id,
        },
    });
    return data;
});
exports.faqService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
