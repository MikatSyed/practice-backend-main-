import express from 'express';
import { CategoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();
router.post(
  '/',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.insertIntoDB
);

router.get('/', CategoryController.getAllFromDB);
router.get('/:id', CategoryController.getByIdFromDB);

router.patch(
  '/:id',
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CategoryController.updateOneInDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CategoryController.deleteByIdFromDB
);

export const CategoryRoutes = router;
