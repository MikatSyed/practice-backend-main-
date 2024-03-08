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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const Signup = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
    return result;
});
const LoginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password &&
        !(yield bcrypt_1.default.compare(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email or Password is incorrect');
    }
    //create access token & refresh token
    const { id: userId, role } = isUserExist;
    const token = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        token,
        refreshToken,
    };
});
const RefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // console.log(verifiedToken);
    const { userId } = verifiedToken;
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new token
    const { id, role } = isUserExist;
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: id,
        role: role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        token: newAccessToken,
    };
});
exports.AuthService = {
    Signup,
    LoginUser,
    RefreshToken,
};
