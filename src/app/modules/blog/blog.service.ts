import { Blog } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import cloudinary from 'cloudinary';

const insertIntoDB = async (data: Blog): Promise<Blog> => {
  const { title, content } = data;
  let { blogImg } = data;
  let images: any = [];

  if (typeof blogImg === 'string') {
    images.push(blogImg);
  } else {
    images = blogImg;
  }
  if (!blogImg) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please Select Image');
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'blog',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  blogImg = imagesLinks.map(image => image.url);

  const result = await prisma.blog.create({
    data: {
      title,
      content,
      blogImg,
      createdAt: new Date(),
    },
  });

  return result;
};

const getAllFromDB = async (): Promise<Blog[]> => {
  const result = await prisma.blog.findMany({});
  return result;
};

const getByIdFromDB = async (id: string): Promise<Blog | null> => {
  const isBlogExist = await prisma.blog.findFirst({
    where: {
      id,
    },
  });

  if (!isBlogExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog does not exist');
  }

  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Blog>
): Promise<Blog> => {
  const isBlogExist = await prisma.blog.findFirst({
    where: {
      id,
    },
  });

  if (!isBlogExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog does not exist');
  }

  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Blog> => {
  const isBlogExist = await prisma.blog.findFirst({
    where: {
      id,
    },
  });

  if (!isBlogExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog does not exist');
  }

  const data = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return data;
};

export const BlogService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
