export interface ErrorModel {
  message: string;
  name: string;
  stack: string;
  code: string | number;
  status: number;
  response?: ErrorResponseModel;
}

interface ErrorResponseModel {
  data: { error: { code: string } };
  message: string;
  status: number;
}
