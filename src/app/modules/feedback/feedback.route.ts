import express from 'express';
import { FeedbackController } from './feedback.controller';

const router = express.Router();

router.post('/', FeedbackController.createFeedBack);

export const FeedbackRoutes = router;
