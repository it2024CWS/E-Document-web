export interface PaginationModel {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Standard response for a single item (e.g., Get by ID)
 * data will be the item itself (T)
 */
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  error_code: string;
  data: T;
}

/**
 * Standard response for a list (Paginated)
 * data contains an 'items' array to match backend structure
 */
export interface PaginatedResponse<T> extends BaseResponse<{ items: T[] }> {
  pagination: PaginationModel;
}

// Aliases for convenience
export type GetByIdResponse<T> = BaseResponse<T>;
export type GetAllResponse<T> = PaginatedResponse<T>;