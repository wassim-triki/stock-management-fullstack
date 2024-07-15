// utils/errorResponse.ts
class ErrorResponse extends Error {
  statusCode: number;
  // code: string;
  details?: string;

  constructor(
    message: string,
    statusCode: number,
    // code: string,
    details?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    // this.code = code;
    if (details) {
      this.details = details;
    }
  }
}

export default ErrorResponse;
