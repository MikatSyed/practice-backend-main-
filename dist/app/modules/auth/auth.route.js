"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validate_1 = require("./auth.validate");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.default)(auth_validate_1.AuthValidation.signupZodSchema), auth_controller_1.AuthController.createUser);
router.post('/login', 
// validateRequest(AuthValidation.loginZodSchema),
auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validate_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.patch('/change-password/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(auth_validate_1.AuthValidation.changePasswordZodSchema), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
