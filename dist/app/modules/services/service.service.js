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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceServices = void 0;
// @typescript-eslint/no-explicit-any
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const queryHelpers_1 = require("../../../helpers/queryHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const service_constant_1 = require("./service.constant");
const cloudinary_1 = __importDefault(require("cloudinary"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, categoryId, duration, description, location, availbility, name, } = data;
    let { serviceImg } = data;
    console.log(serviceImg, 'ggg');
    const isNameExist = yield prisma_1.default.user.findFirst({
        where: {
            name,
        },
    });
    if (isNameExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Name already exits');
    }
    if (serviceImg) {
        let images = [];
        if (typeof serviceImg === 'string') {
            images.push(serviceImg);
        }
        else {
            images = serviceImg;
        }
        if (!serviceImg) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please Select Image');
        }
        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = yield cloudinary_1.default.v2.uploader.upload(images[i], {
                folder: 'services',
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        serviceImg = imagesLinks.map(image => image.url);
    }
    const result = yield prisma_1.default.service.create({
        data: {
            name,
            price,
            categoryId,
            duration,
            description,
            location,
            serviceImg,
            availbility,
        },
        include: {
            category: true,
        },
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = queryHelpers_1.queryHelpers.calculatePagination(options);
    const { searchTerm, minPrice, maxPrice } = filters, filterData = __rest(filters, ["searchTerm", "minPrice", "maxPrice"]);
    let newMinPrice;
    let newMaxPrice;
    if (typeof minPrice === 'string') {
        newMinPrice = parseInt(minPrice);
    }
    if (typeof maxPrice === 'string') {
        newMaxPrice = parseInt(maxPrice);
    }
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                ...service_constant_1.ServiceSearchableFields.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                })),
                {
                    category: {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    if (newMinPrice && newMaxPrice) {
        andConditions.push({
            price: {
                gte: newMinPrice,
                lte: newMaxPrice,
            },
        });
    }
    else if (newMinPrice) {
        andConditions.push({
            price: {
                gte: newMinPrice,
            },
        });
    }
    else if (newMaxPrice) {
        andConditions.push({
            price: {
                lte: newMaxPrice,
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (service_constant_1.ServiceRelationalFields.includes(key)) {
                    return {
                        [service_constant_1.ServiceRelationalFieldsMapper[key]]: {
                            id: filterData[key],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.service.findMany({
        include: {
            category: true,
            reviews: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.service.count({
        where: whereConditions,
    });
    const servicesWithStatistics = result.map(service => {
        const reviews = service.reviews;
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        return Object.assign(Object.assign({}, service), { totalReviews,
            averageRating });
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: servicesWithStatistics,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isserviceExist = yield prisma_1.default.service.findFirst({
        where: {
            id,
        },
    });
    if (!isserviceExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'service does not exist');
    }
    const result = yield prisma_1.default.service.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            reviews: true,
            bookings: true,
        },
    });
    if (result) {
        if ((result === null || result === void 0 ? void 0 : result.reviews) && result.reviews.length > 0) {
            const totalReviews = result.reviews.length;
            // Calculate average rating
            const sumOfRatings = result.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const averageRating = sumOfRatings / totalReviews;
            // Add the calculated values to the result object
            result.averageRating = averageRating;
            result.totalReviews = totalReviews;
        }
        else {
            // If there are no reviews, set default values
            result.averageRating = null;
            result.totalReviews = null;
        }
    }
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isserviceExist = yield prisma_1.default.service.findFirst({
        where: {
            id,
        },
    });
    console.log(isserviceExist);
    if (!isserviceExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'service does not exist');
    }
    if (payload.availbility &&
        isserviceExist.availbility === client_1.Availbility.available &&
        payload.availbility === client_1.Availbility.upcoming) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'can only change from upcoming to available');
    }
    const result = yield prisma_1.default.service.update({
        where: {
            id,
        },
        data: payload,
        include: {
            category: true,
        },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    yield prisma_1.default.$transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const isserviceExist = yield transaction.service.findFirst({
            where: {
                id,
            },
            include: {
                bookings: true, // Include bookings relation
            },
        });
        if (!isserviceExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'service does not exist');
        }
        // Delete bookings associated with the service
        yield transaction.booking.deleteMany({
            where: {
                serviceId: id,
            },
        });
        // Delete reviews associated with the service
        yield transaction.review.deleteMany({
            where: {
                serviceId: id,
            },
        });
        // Delete the service
        result = yield transaction.service.delete({
            where: {
                id,
            },
            include: {
                category: true,
            },
        });
    }));
    return result;
});
exports.ServiceServices = {
    insertIntoDB,
    getAllFromDB,
    // getByCategoryIdFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
