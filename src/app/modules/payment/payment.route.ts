import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post('/success', PaymentController.paymentVerify);
router.post('/init', PaymentController.initPayment);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PaymentController.getAllFromDB
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PaymentController.deleteFromDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PaymentController.deleteFromDB
);

router.post('/webhook', PaymentController.webhook);

export const paymentRoutes = router;
