import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const getUserProfile = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  return result;
};

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

export const ProfileService = {
  getUserProfile,
};
