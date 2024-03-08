"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSlotsController = void 0;
const timeSlots_services_1 = require("./timeSlots.services");
const createTimeSlot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timeSlotData = __rest(req.body, []);
        const timeSlot = yield timeSlots_services_1.timeSlotsServices.createTimeSlot(timeSlotData);
        res.status(200).json({
            status: 'success',
            message: 'Time Slot created successfully',
            data: timeSlot,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllTimeSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timeSlots = yield timeSlots_services_1.timeSlotsServices.getAllTimeSlots();
        res.status(200).json({
            status: 'success',
            message: 'Time Slots fetched successfully',
            data: timeSlots.data,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleTimeSlot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const timeSlot = yield timeSlots_services_1.timeSlotsServices.getSingleTimeSlot(id);
        res.status(200).json({
            status: 'success',
            message: 'Time Slot fetched successfully',
            data: timeSlot,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateTimeSlot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const timeSlotData = __rest(req.body, []);
        const timeSlot = yield timeSlots_services_1.timeSlotsServices.updateTimeSlot(id, timeSlotData);
        res.status(200).json({
            status: 'success',
            message: 'Time Slot updated successfully',
            data: timeSlot,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteTimeSlot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const timeSlot = yield timeSlots_services_1.timeSlotsServices.deleteTimeSlot(id);
        res.status(200).json({
            status: 'success',
            message: 'Time Slot deleted successfully',
            data: timeSlot,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.timeSlotsController = {
    createTimeSlot,
    getAllTimeSlots,
    getSingleTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
};
