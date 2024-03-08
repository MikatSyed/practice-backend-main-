"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validate_1 = require("./user.validate");
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getByIdFromDB);
router.patch('/:id', (0, validateRequest_1.default)(user_validate_1.UserValidation.userUpdateZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteByIdFromDB);
exports.UserRoutes = router;
