import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BookingController } from './booking.controller';

const router = express.Router();

router.get('/check-available-slot', BookingController.fetchBookingsForDate);
router.get('/:id', BookingController.getByIdFromDB);
router.get('/statistics', BookingController.getStatistics);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  BookingController.insertIntoDB
);

router.get('/', BookingController.getAllFromDB);

router.patch(
  '/:id',

  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookingController.updateOneInDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BookingController.deleteByIdFromDB
);

export const BookingRoutes = router;
