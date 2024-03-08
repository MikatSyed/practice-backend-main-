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
exports.BookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    const { userId, serviceId, slotId, bookingDate } = data;
    // Create the booking if it doesn't already exist
    const existingBooking = yield prisma_1.default.booking.findFirst({
        where: {
            slotId,
            serviceId,
            bookingDate,
        },
    });
    if (existingBooking) {
        // The slot is already booked for this date and service
        throw new Error('Slot is not available for this date and service.');
    }
    const result = yield prisma_1.default.booking.create({
        data: {
            bookingDate,
            userId,
            serviceId,
            slotId,
            // Other fields...
        },
    });
    return result;
});
const fetchBookingsForDate = (bookingDate) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('s', bookingDate);
    if (bookingDate) {
        const bookings = yield prisma_1.default.booking.findMany({
            where: {
                bookingDate,
            },
        });
        console.log(bookings);
        return bookings;
    }
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findMany({
        include: {
            user: true,
            service: true,
            slot: true, // Include the TimeSlots relation
            // Include the Payment relation
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield prisma_1.default.booking.findFirst({
        where: {
            id,
        },
    });
    if (!isBookingExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Booking does not exist');
    }
    const result = yield prisma_1.default.booking.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            service: true,
            slot: true, // Include the TimeSlots relation
            // Include the Payment relation
        },
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield prisma_1.default.booking.findFirst({
        where: {
            id,
        },
    });
    if (!isBookingExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Booking does not exist');
    }
    const result = yield prisma_1.default.booking.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
// const deleteByIdFromDB = async (id: string): Promise<Booking> => {
//   const isBookingExist = await prisma.booking.findFirst({
//     where: {
//       id,
//     },
//   });
//   if (!isBookingExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not exist');
//   }
//   const data = await prisma.booking.delete({
//     where: {
//       id,
//     },
//   });
//   return data;
// };
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield prisma_1.default.booking.findFirst({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.payment.deleteMany({
            where: {
                bookingId: isBookingExist === null || isBookingExist === void 0 ? void 0 : isBookingExist.id,
            },
        });
        const data = yield transactionClient.booking.delete({
            where: {
                id,
            },
        });
        return data;
    }));
    return result;
});
const getStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('hitted');
    const totalUsers = yield prisma_1.default.user.count();
    const totalBookings = yield prisma_1.default.booking.count();
    const totalServices = yield prisma_1.default.service.count();
    const data = {
        totalBookings,
        totalServices,
        totalUsers,
    };
    return data;
});
exports.BookingService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    fetchBookingsForDate,
    getStatistics,
};
