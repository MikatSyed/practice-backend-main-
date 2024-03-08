import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validate';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getAllUsers
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getByIdFromDB
);
router.patch(
  '/:id',
  validateRequest(UserValidation.userUpdateZodSchema),
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.updateOneInDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.deleteByIdFromDB
);

export const UserRoutes = router;
