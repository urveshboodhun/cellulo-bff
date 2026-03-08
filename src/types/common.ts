export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateOrderPayload {
  package_id: string;
  quantity: number;
  type: string;
  description?: string;
}

export interface PaginationMeta {
  last_page: number;
  current_page: number;
  total: number;
}
