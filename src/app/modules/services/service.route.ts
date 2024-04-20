import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceController } from './service.controller';
import { ServiceValidation } from './services.validate';

const router = express.Router();



router.get('/overview', ServiceController.getOverview);
router.post(
  '/',
  validateRequest(ServiceValidation.createServiceZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ServiceController.insertIntoDB
);

router.get('/', ServiceController.getAllFromDB);

// router.get('/:categoryId/category', BookController.getByCategoryIdFromDB);

router.get('/:id', ServiceController.getByIdFromDB);


router.patch(
  '/:id',
  validateRequest(ServiceValidation.updateServiceZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  ServiceController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ServiceController.deleteByIdFromDB
);

export const ServiceRoutes = router;
