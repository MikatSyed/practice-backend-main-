import { Role } from '@prisma/client';

export type IResponseUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  contactNo: string;
  address: string;
  profileImg: string[]; // Update this to match the database model
  createdAt: Date;
};
