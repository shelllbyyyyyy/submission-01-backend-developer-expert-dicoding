export interface IBaseResponse {
  status: 'fail' | 'success' | 'error';
}

export interface IErrorResponse extends IBaseResponse {
  message: string;
}

export interface IResponse<T> extends IBaseResponse {
  data: T;
}
