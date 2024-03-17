import express from 'express';
import { timeSlotsController } from './timeSlots.controller';

const router = express.Router();

router.delete('/:id', timeSlotsController.deleteTimeSlot);
router.post('/', timeSlotsController.createTimeSlot);
router.get('/', timeSlotsController.getAllTimeSlots);
router.get('/:id', timeSlotsController.getSingleTimeSlot);
router.patch('/:id', timeSlotsController.updateTimeSlot);

export const timeSlotsRoutes = router;
