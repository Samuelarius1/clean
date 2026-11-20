// src/types.ts

export type UserRole = 'superadmin' | 'admin' | 'staff' | 'client';

export interface User {
  id: number | string;  // ✅ Allow both string and number
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  [key: string]: any; // Allow additional properties
}

export type LoginHandler = (userData: User, token: string) => void;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}