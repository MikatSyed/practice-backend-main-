"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/success', payment_controller_1.PaymentController.paymentVerify);
router.post('/init', payment_controller_1.PaymentController.initPayment);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), payment_controller_1.PaymentController.getAllFromDB);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), payment_controller_1.PaymentController.deleteFromDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), payment_controller_1.PaymentController.deleteFromDB);
router.post('/webhook', payment_controller_1.PaymentController.webhook);
exports.paymentRoutes = router;
