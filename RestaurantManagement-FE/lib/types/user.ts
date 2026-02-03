import type { ApiResponse, PageResponse } from "./api";

/** Role: SYSTEM_ADMIN | RESTAURANT_ADMIN | STAFF | USER */
export type Role = "SYSTEM_ADMIN" | "RESTAURANT_ADMIN" | "STAFF" | "USER";

export const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "System Admin",
  RESTAURANT_ADMIN: "Restaurant Admin",
  STAFF: "Staff",
  USER: "Guest",
};

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  isVerified: boolean;
  /** From API when available; otherwise use dashboard role selector for demo */
  role?: Role;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
}

export type UsersPageResponse = ApiResponse<PageResponse<UserResponse>>;
export type UserDetailResponse = ApiResponse<UserResponse>;
