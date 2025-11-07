import { IUser } from '@/models/User';

// Utility type to convert Mongoose document to plain object
export type UserResponse = Omit<IUser, 'password' | 'comparePassword'> & {
  _id: string;
};

// Auth user type for NextAuth
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  emailVerified: boolean;
}