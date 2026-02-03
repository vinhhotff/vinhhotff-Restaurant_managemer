export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
  error?: string;
  timestamp: string;
  traceId?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
