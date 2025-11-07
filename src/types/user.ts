export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  image?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'moderator' | 'user';
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'moderator' | 'user';
  image?: string;
  isActive?: boolean;
}