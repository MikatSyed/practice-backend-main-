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
exports.PaymentService = void 0;
// @typescript-eslint/no-unused-vars
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const payment_constants_1 = require("./payment.constants");
const queryHelpers_1 = require("../../../helpers/queryHelpers");
const ssl_service_1 = require("../ssl/ssl.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const initPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    function generateSixDigitId() {
        const timestamp = Date.now();
        const sixDigitId = timestamp % 1000000;
        const sixDigitIdString = sixDigitId.toString().padStart(6, '0');
        return sixDigitIdString;
    }
    const transactionId = generateSixDigitId();
    console.log(data);
    const paymentSession = yield ssl_service_1.sslService.initPayment({
        total_amount: data.amount,
        tran_id: transactionId,
        cus_name: data.name,
        cus_email: data.email,
        cus_add1: data.address,
        cus_phone: data.phone,
    });
    const pdata = yield prisma_1.default.payment.create({
        data: {
            amount: data.amount,
            transactionId: transactionId,
            userId: data.userId,
            bookingId: data.bookingId,
        },
    });
    console.log(pdata);
    return paymentSession.redirectGatewayURL;
    // return pdata;
});
// const paymentVerify = async (id: any) => {
//   const result = await prisma.payment.updateMany({
//     where: {
//       transactionId: id,
//     },
//     data: {
//       status: PaymentStatus.PAID,
//     },
//   });
//   // Return the result or use it in the calling function
//   return result;
// };
const paymentVerify = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isPaymentExist = yield prisma_1.default.payment.findFirst({
        where: {
            id,
        },
    });
    if (!isPaymentExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Payment does not exist');
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Update payment status to PAID
        const updatedPayments = yield transactionClient.payment.updateMany({
            where: {
                transactionId: id,
            },
            data: {
                status: client_1.PaymentStatus.PAID,
            },
        });
        if (updatedPayments) {
            yield transactionClient.booking.update({
                where: {
                    id: isPaymentExist === null || isPaymentExist === void 0 ? void 0 : isPaymentExist.bookingId,
                },
                data: {
                    isPaid: true,
                },
            });
        }
        return updatedPayments;
    }));
    return result;
});
const webhook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload || !(payload === null || payload === void 0 ? void 0 : payload.status) || (payload === null || payload === void 0 ? void 0 : payload.status) !== 'VALID') {
        return {
            massage: 'Invalid Payment!',
        };
    }
    const result = yield ssl_service_1.sslService.validate(payload);
    if ((result === null || result === void 0 ? void 0 : result.status) !== 'VALID') {
        return {
            massage: 'Payment failed',
        };
    }
    const { tran_id } = result;
    yield prisma_1.default.payment.updateMany({
        where: {
            transactionId: tran_id,
        },
        data: {
            status: client_1.PaymentStatus.PAID,
            paymentGatewayData: payload,
        },
    });
    return {
        massage: 'Payment Success',
    };
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = queryHelpers_1.queryHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: payment_constants_1.paymentSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.payment.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.PaymentService = {
    initPayment,
    webhook,
    getAllFromDB,
    deleteFromDB,
    paymentVerify,
};
