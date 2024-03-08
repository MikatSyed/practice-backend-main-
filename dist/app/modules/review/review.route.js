"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validate_1 = require("./review.validate");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(review_validate_1.ReviewValidation.reviewZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), review_controller_1.ReviewController.postReview);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), review_controller_1.ReviewController.getReviewByServiceId);
router.get('/', review_controller_1.ReviewController.getAllReview);
exports.ReviewRoutes = router;
