"use strict";
/* eslint-disable no-undef */
/* @typescript-eslint/no-unused-vars */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const sendMail_1 = require("../../utils/sendMail");
const promises_1 = __importDefault(require("fs/promises"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, contactNo, address } = data;
    const isEmailExist = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (isEmailExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already exits');
    }
    let { profileImg } = data;
    let images = [];
    if (typeof profileImg === 'string') {
        images.push(profileImg);
    }
    else {
        images = profileImg;
    }
    if (!profileImg) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please Select Image');
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = yield cloudinary_1.default.v2.uploader.upload(images[i], {
            folder: 'auth',
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    profileImg = imagesLinks.map(image => image.url);
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bycrypt_salt_rounds));
    const result = yield prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            contactNo,
            address,
            profileImg,
            createdAt: new Date(),
        },
    });
    const subject = 'Welcome to Home Service - Your Login Details';
    const from = process.env.Email;
    const htmlContent = yield promises_1.default.readFile(__dirname + '/../../utils/welcome_email_template.html', 'utf8');
    const replacedHtmlContent = htmlContent
        .replace('{{ email }}', email)
        .replace('{{ password }}', password);
    if (result) {
        (0, sendMail_1.sendEMail)(from, result.email, subject, replacedHtmlContent);
    }
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
            createdAt: true,
        },
    });
    return result;
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
            createdAt: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User Not Found!');
    }
    return result;
});
// const updateOneInDB = async (
//   id: string,
//   payload: Partial<User>
// ): Promise<IResponseUser> => {
//   const isUserExist = await prisma.user.findFirst({
//     where: {
//       id,
//     },
//   });
//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
//   }
//   console.log(payload,'138');
//   let { password, profileImg,...userData } = payload;
//   if(profileImg){
//     let images: any = [];
//     if (typeof profileImg === 'string') {
//       images.push(profileImg);
//     } else {
//       images = profileImg;
//     }
//     const imagesLinks = [];
//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: 'auth',
//     });
//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }
//   profileImg = imagesLinks.map(image => image.url);
//   }
//   const updatedUserData: Partial<User> = { ...userData };
//   if (password) {
//     const salt = await bcrypt.genSalt(Number(config.bycrypt_salt_rounds));
//     const hashedPassword = await bcrypt.hash(password, salt);
//     updatedUserData.password = hashedPassword;
//   }
//   const result = await prisma.user.update({
//     where: {
//       id,
//     },
//     data: updatedUserData,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       contactNo: true,
//       address: true,
//       profileImg: true,
//       createdAt: true,
//     },
//   });
//   return result;
// };
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // Destructure payload
    let { password, profileImg } = payload, userData = __rest(payload, ["password", "profileImg"]);
    // Handle profile image update
    if (profileImg) {
        // Upload new profile image to Cloudinary
        let images = [];
        if (typeof profileImg === 'string') {
            images.push(profileImg);
        }
        else {
            images = profileImg;
        }
        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = yield cloudinary_1.default.v2.uploader.upload(images[i], {
                folder: 'auth',
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        profileImg = imagesLinks.map((image) => image.url);
        // Delete old profile image(s) if they exist
        if (isUserExist.profileImg && isUserExist.profileImg.length > 0) {
            // Assuming profileImg is an array of URLs
            const publicIds = isUserExist.profileImg.map((url) => url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')));
            // Delete images from Cloudinary
            yield Promise.all(publicIds.map((publicId) => cloudinary_1.default.v2.uploader.destroy(publicId, { invalidate: true })));
        }
    }
    // Handle password update
    if (password) {
        const salt = yield bcrypt_1.default.genSalt(Number(config_1.default.bycrypt_salt_rounds));
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        userData.password = hashedPassword;
    }
    // Update user data in the database
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: Object.assign(Object.assign({}, userData), { profileImg: profileImg || isUserExist.profileImg }),
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
            createdAt: true,
        },
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.UserService = {
    createUser,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
