import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ServiceRoutes } from '../modules/services/service.route';

import { FaqRoutes } from '../modules/faq/faq.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { ProfileRoutes } from '../modules/profile/profile.route';

import { FeedbackRoutes } from '../modules/feedback/feedback.route';


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
    path: '/feedback',
    route: FeedbackRoutes,
  },
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
