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
exports.ProfileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getUserProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    return result;
});
// const updateProfile = async (data: User): Promise<Partial<User>> => {
//   const { name, email, password, role, contactNo, address } = data;
//   const isEmailExist = await prisma.user.findFirst({
//     where: {
//       email,
//     },
//   });
//   if (isEmailExist) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exits');
//   }
//   let { profileImg } = data;
//   let images: any = [];
//   if (typeof profileImg === 'string') {
//     images.push(profileImg);
//   } else {
//     images = profileImg;
//   }
//   if (!profileImg) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Please Select Image');
//   }
//   const imagesLinks = [];
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
//   const hashedPassword = await bcrypt.hash(
//     password,
//     Number(config.bycrypt_salt_rounds)
//   );
//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       contactNo,
//       address,
//       profileImg,
//       createdAt: new Date(),
//     },
//   });
//   const subject = 'Welcome to Home Service - Your Login Details';
//   const from = process.env.Email;
//   const htmlContent = await fs.readFile(__dirname + '/../../utils/welcome_email_template.html', 'utf8');
//   const replacedHtmlContent = htmlContent
//   .replace('{{ email }}', email)
//   .replace('{{ password }}', password);
//   if (result) {
//     sendEMail(from, result.email, subject, replacedHtmlContent);
//   }
//   return result;
// };
exports.ProfileService = {
    getUserProfile,
};
