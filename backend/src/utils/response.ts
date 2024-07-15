// utils/response.ts
export class SuccessResponse<T> {
  success: boolean;
  payload: {
    message: string;
    data?: T;
  };

  constructor(message: string, data?: T) {
    this.success = true;
    this.payload = { message, data };
  }
}

export class ErrorResponse extends Error {
  success: boolean;
  statusCode: number;
  details?: string;

  constructor(message: string, statusCode: number, details?: string) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }
  }
}
