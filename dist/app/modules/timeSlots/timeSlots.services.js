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
exports.timeSlotsServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createTimeSlot = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTimeSlot = yield prisma_1.default.timeSlots.findFirst({
        where: { startTime: data.startTime },
    });
    if (existingTimeSlot) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'A time slot with the same startTime already exists.');
    }
    const result = yield prisma_1.default.timeSlots.create({
        data,
    });
    return result;
});
const getAllTimeSlots = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.timeSlots.findMany();
    const total = yield prisma_1.default.timeSlots.count();
    return {
        meta: {
            total,
        },
        data: result,
    };
});
const getSingleTimeSlot = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.timeSlots.findUnique({
        where: {
            id: id,
        },
    });
    return result;
});
const updateTimeSlot = (id, timeSlot) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.timeSlots.update({
        where: {
            id: id,
        },
        data: timeSlot,
    });
    return result;
});
const deleteTimeSlot = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTimeSlot = yield prisma_1.default.timeSlots.findFirst({
        where: {
            id,
        },
    });
    if (!existingTimeSlot) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Slot does not exist');
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.booking.deleteMany({
            where: {
                slotId: existingTimeSlot === null || existingTimeSlot === void 0 ? void 0 : existingTimeSlot.id,
            },
        });
        const data = yield transactionClient.timeSlots.delete({
            where: {
                id,
            },
        });
        return data;
    }));
    return result;
});
exports.timeSlotsServices = {
    createTimeSlot,
    getAllTimeSlots,
    getSingleTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
};
