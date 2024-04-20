import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ServiceRoutes } from '../modules/services/service.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { FaqRoutes } from '../modules/faq/faq.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { timeSlotsRoutes } from '../modules/timeSlots/timeSlots.routes';
import { BookingRoutes } from '../modules/booking/booking.route';
import { FeedbackRoutes } from '../modules/feedback/feedback.route';
import { paymentRoutes } from '../modules/payment/payment.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/faqs',
    route: FaqRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/time-slots',
    route: timeSlotsRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes,
  },
  {
    path: '/feedback',
    route: FeedbackRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
