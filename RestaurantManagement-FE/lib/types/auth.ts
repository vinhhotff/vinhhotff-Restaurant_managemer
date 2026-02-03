export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface UserAuth {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  isVerified?: boolean;
}
