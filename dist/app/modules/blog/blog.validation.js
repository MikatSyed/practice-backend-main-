"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const createBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'question is required',
        }),
        content: zod_1.z.string({
            required_error: 'answer is required',
        }),
    }),
});
const updateBlogZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'question is required',
        })
            .optional(),
        content: zod_1.z
            .string({
            required_error: 'answer is required',
        })
            .optional(),
    }),
});
exports.BlogValidation = {
    createBlogZodSchema,
    updateBlogZodSchema,
};
