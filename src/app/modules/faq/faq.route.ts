import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validation';

const router = express.Router();
router.post(
  '/',
  validateRequest(FaqValidation.createFaqZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  FaqController.insertIntoDB
);

router.get('/', FaqController.getAllFromDB);
router.get('/:id', FaqController.getByIdFromDB);

router.patch(
  '/:id',
  validateRequest(FaqValidation.updateFaqZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  FaqController.updateOneInDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  FaqController.deleteByIdFromDB
);

export const FaqRoutes = router;
