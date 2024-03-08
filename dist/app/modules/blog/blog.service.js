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
exports.BlogService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = data;
    let { blogImg } = data;
    let images = [];
    if (typeof blogImg === 'string') {
        images.push(blogImg);
    }
    else {
        images = blogImg;
    }
    if (!blogImg) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please Select Image');
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = yield cloudinary_1.default.v2.uploader.upload(images[i], {
            folder: 'blog',
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    blogImg = imagesLinks.map(image => image.url);
    const result = yield prisma_1.default.blog.create({
        data: {
            title,
            content,
            blogImg,
            createdAt: new Date(),
        },
    });
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findMany({});
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogExist = yield prisma_1.default.blog.findFirst({
        where: {
            id,
        },
    });
    if (!isBlogExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog does not exist');
    }
    const result = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogExist = yield prisma_1.default.blog.findFirst({
        where: {
            id,
        },
    });
    if (!isBlogExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog does not exist');
    }
    const result = yield prisma_1.default.blog.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogExist = yield prisma_1.default.blog.findFirst({
        where: {
            id,
        },
    });
    if (!isBlogExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Blog does not exist');
    }
    const data = yield prisma_1.default.blog.delete({
        where: {
            id,
        },
    });
    return data;
});
exports.BlogService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
