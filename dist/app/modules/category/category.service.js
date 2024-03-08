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
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryHelpers_1 = require("../../../helpers/queryHelpers");
const cloudinary_1 = __importDefault(require("cloudinary"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = data;
    let { categoryImg } = data;
    const myCloud = yield cloudinary_1.default.v2.uploader.upload(categoryImg, {
        folder: 'images',
        width: 150,
        crop: 'scale',
    });
    categoryImg = myCloud.secure_url;
    const result = yield prisma_1.default.category.create({
        data: {
            title,
            categoryImg,
        },
    });
    return result;
});
const getAllFromDB = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = queryHelpers_1.queryHelpers.calculatePagination(options);
    const result = yield prisma_1.default.category.findMany({
        include: {
            services: true,
        },
    });
    const total = yield prisma_1.default.category.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield prisma_1.default.category.findFirst({
        where: {
            id,
        },
    });
    if (!isCategoryExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category does not exist');
    }
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield prisma_1.default.category.findFirst({
        where: {
            id,
        },
    });
    if (!isCategoryExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category does not exist');
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((prismaClient) => __awaiter(void 0, void 0, void 0, function* () {
        const existingCategory = yield prismaClient.category.findFirst({
            where: {
                id,
            },
            include: {
                services: true, // Include associated services
            },
        });
        if (!existingCategory) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category does not exist');
        }
        // Delete the associated services
        yield prismaClient.service.deleteMany({
            where: {
                categoryId: id,
            },
        });
        // Delete the category
        const deletedCategory = yield prismaClient.category.delete({
            where: {
                id,
            },
        });
        return deletedCategory;
    }));
    return result;
});
exports.CategoryService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
