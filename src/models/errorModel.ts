export interface ErrorModel {
  message: string;
  name: string;
  stack: string;
  code: string | number;
  status: number;
  response?: ErrorResponseModel;
}

interface ErrorResponseModel {
  data: {
    success: boolean;
    message: string;
    error_code?: string;
    data?: any;
  };
  message: string;
  status: number;
}
