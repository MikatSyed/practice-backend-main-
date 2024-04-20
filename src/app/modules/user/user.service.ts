/* eslint-disable no-undef */
/* @typescript-eslint/no-unused-vars */

import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IResponseUser } from './user.interface';
import cloudinary from 'cloudinary';
import { sendEMail } from '../../utils/sendMail';
import fs from "fs/promises";

const createUser = async (data: User): Promise<Partial<User>> => {
  const { name, email, password, role, contactNo, address } = data;

  const isEmailExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exits');
  }

  let { profileImg } = data;
  let images: any = [];

  if (typeof profileImg === 'string') {
    images.push(profileImg);
  } else {
    images = profileImg;
  }
  if (!profileImg) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please Select Image');
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'auth',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  profileImg = imagesLinks.map(image => image.url);

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bycrypt_salt_rounds)
  );
  const result = await prisma.user.create({
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
  const htmlContent = await fs.readFile(__dirname + '/../../utils/welcome_email_template.html', 'utf8');

 
  const replacedHtmlContent = htmlContent
  .replace('{{ email }}', email)
  .replace('{{ password }}', password);

  if (result) {
    sendEMail(from, result.email, subject, replacedHtmlContent);
  }
  return result;
};


const getAllFromDB = async (): Promise<Partial<IResponseUser[]>> => {
  const result = await prisma.user.findMany({
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
};

const getByIdFromDB = async (id: string): Promise<IResponseUser | null> => {
  const result = await prisma.user.findUnique({
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
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found!');
  }
  return result;
};

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

const updateOneInDB = async (
  id: string,
  payload: Partial<User>
): Promise<IResponseUser> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Destructure payload
  let { password, profileImg, ...userData }:any = payload;

  // Handle profile image update
  if (profileImg) {
    // Upload new profile image to Cloudinary
    let images: any = [];
    if (typeof profileImg === 'string') {
      images.push(profileImg);
    } else {
      images = profileImg;
    }

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
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
      const publicIds = isUserExist.profileImg.map((url) =>
        url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
      );

      // Delete images from Cloudinary
      await Promise.all(
        publicIds.map((publicId) =>
          cloudinary.v2.uploader.destroy(publicId, { invalidate: true })
        )
      );
    }
  }

  // Handle password update
  if (password) {
    const salt = await bcrypt.genSalt(Number(config.bycrypt_salt_rounds));
    const hashedPassword = await bcrypt.hash(password, salt);
    userData.password = hashedPassword;
  }

  // Update user data in the database
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...userData,
      profileImg: profileImg || isUserExist.profileImg, // Keep old image(s) if new one is not provided
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

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IResponseUser> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });

  return result;
};

export const UserService = {
  createUser,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  
};
