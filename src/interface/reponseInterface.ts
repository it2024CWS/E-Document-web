export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GetAllResponse<T> {
  success: boolean;
  message: string;
  error_code: string;
  data: {
    items: T[];
  };
  pagination: PaginationInfo;
}

export interface GetByIdResponse<T> {
  success: boolean;
  message: string;
  error_code: string;
  data: T;
}