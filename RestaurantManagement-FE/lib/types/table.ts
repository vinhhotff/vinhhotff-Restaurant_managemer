import type { ApiResponse } from "./api";

export interface TableRequest {
  restaurantId: number;
  areaId: number;
  tableNumber: string;
  tableName: string;
  capacity: number;
  minPersons?: number;
  positionDescription?: string;
  status?: string;
  features?: Record<string, unknown>;
}

export interface TableResponse {
  id: number;
  restaurantId: number;
  areaId: number;
  areaName: string;
  tableNumber: string;
  tableName: string;
  capacity: number;
  minPersons?: number;
  positionDescription?: string;
  status?: string;
  features?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type TableListResponse = ApiResponse<TableResponse[]>;
export type TableDetailResponse = ApiResponse<TableResponse>;
