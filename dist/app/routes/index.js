"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const category_route_1 = require("../modules/category/category.route");
const service_route_1 = require("../modules/services/service.route");
const review_route_1 = require("../modules/review/review.route");
const faq_route_1 = require("../modules/faq/faq.route");
const blog_route_1 = require("../modules/blog/blog.route");
const profile_route_1 = require("../modules/profile/profile.route");
const timeSlots_routes_1 = require("../modules/timeSlots/timeSlots.routes");
const booking_route_1 = require("../modules/booking/booking.route");
const feedback_route_1 = require("../modules/feedback/feedback.route");
const payment_route_1 = require("../modules/payment/payment.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/services',
        route: service_route_1.ServiceRoutes,
    },
    {
        path: '/review',
        route: review_route_1.ReviewRoutes,
    },
    {
        path: '/faqs',
        route: faq_route_1.FaqRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/profile',
        route: profile_route_1.ProfileRoutes,
    },
    {
        path: '/time-slots',
        route: timeSlots_routes_1.timeSlotsRoutes,
    },
    {
        path: '/booking',
        route: booking_route_1.BookingRoutes,
    },
    {
        path: '/feedback',
        route: feedback_route_1.FeedbackRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
