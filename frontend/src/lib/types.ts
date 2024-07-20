export type ApiErrorResponse = {
  success: boolean;
  error: {
    message: string;
    details?: string;
  };
};
export type ApiSuccessResponse = {
  success: boolean;
  payload: {
    message: string;
    data?: object;
  };
};

export type User = {
  email: string;
};
