"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidation = void 0;
const zod_1 = require("zod");
const createServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        location: zod_1.z.string({
            required_error: 'Location is required',
        }),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
        })
            .nonnegative(),
        serviceImg: zod_1.z.string({
            required_error: 'Image URL is required',
        }),
        duration: zod_1.z.string({
            required_error: 'Duration is required',
        }),
        categoryId: zod_1.z.string({
            required_error: 'Category ID is required',
        }),
    }),
});
const updateServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        image: zod_1.z.string().optional(),
        duration: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().optional(),
    }),
});
exports.ServiceValidation = {
    createServiceZodSchema,
    updateServiceZodSchema,
};
