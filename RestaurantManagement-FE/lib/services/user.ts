import api from "@/lib/api";
import { User, ApiResponse } from "@/lib/types";

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },
};
