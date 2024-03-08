import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import cloudinary from 'cloudinary';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const Signup = async (data: User): Promise<Partial<User>> => {
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

  return result;
};

const LoginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist.password))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Email or Password is incorrect'
    );
  }

  //create access token & refresh token
  const { id: userId, role } = isUserExist;

  const token = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    token,
    refreshToken,
  };
};

const RefreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  // console.log(verifiedToken);
  const { userId } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token
  const { id, role } = isUserExist;
  const newAccessToken = jwtHelpers.createToken(
    {
      id: id,
      role: role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    token: newAccessToken,
  };
};
export const AuthService = {
  Signup,
  LoginUser,
  RefreshToken,
};
