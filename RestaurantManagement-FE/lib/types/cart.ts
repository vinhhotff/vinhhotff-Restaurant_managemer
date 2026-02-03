import type { ApiResponse } from "./api";

export interface CartItemRequest {
  userId: number;
  restaurantId: number;
  menuId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface CartItemResponse {
  id?: number;
  userId: number;
  restaurantId: number;
  menuId: number;
  quantity: number;
  specialInstructions?: string;
  updatedAt: string;
}

export type CartItemListResponse = ApiResponse<CartItemResponse[]>;
export type CartItemDetailResponse = ApiResponse<CartItemResponse>;
