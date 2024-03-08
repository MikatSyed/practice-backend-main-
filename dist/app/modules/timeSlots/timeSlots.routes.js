"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSlotsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const timeSlots_controller_1 = require("./timeSlots.controller");
const router = express_1.default.Router();
router.delete('/:id', timeSlots_controller_1.timeSlotsController.deleteTimeSlot);
router.post('/', timeSlots_controller_1.timeSlotsController.createTimeSlot);
router.get('/', timeSlots_controller_1.timeSlotsController.getAllTimeSlots);
router.get('/:id', timeSlots_controller_1.timeSlotsController.getSingleTimeSlot);
router.patch('/:id', timeSlots_controller_1.timeSlotsController.updateTimeSlot);
exports.timeSlotsRoutes = router;
