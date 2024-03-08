"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(category_validation_1.CategoryValidation.createCategoryZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), category_controller_1.CategoryController.insertIntoDB);
router.get('/', category_controller_1.CategoryController.getAllFromDB);
router.get('/:id', category_controller_1.CategoryController.getByIdFromDB);
router.patch('/:id', (0, validateRequest_1.default)(category_validation_1.CategoryValidation.updateCategoryZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), category_controller_1.CategoryController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), category_controller_1.CategoryController.deleteByIdFromDB);
exports.CategoryRoutes = router;
