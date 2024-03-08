"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const reviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
        serviceId: zod_1.z.string().uuid(),
        rating: zod_1.z.number().min(1).max(5),
        comment: zod_1.z.string(),
    }),
});
exports.ReviewValidation = {
    reviewZodSchema,
};
