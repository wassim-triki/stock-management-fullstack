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
  _id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  role: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};
