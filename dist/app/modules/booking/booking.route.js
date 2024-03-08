"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.get('/check-available-slot', booking_controller_1.BookingController.fetchBookingsForDate);
router.get('/:id', booking_controller_1.BookingController.getByIdFromDB);
router.get('/statistics', booking_controller_1.BookingController.getStatistics);
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), booking_controller_1.BookingController.insertIntoDB);
router.get('/', booking_controller_1.BookingController.getAllFromDB);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), booking_controller_1.BookingController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), booking_controller_1.BookingController.deleteByIdFromDB);
exports.BookingRoutes = router;
