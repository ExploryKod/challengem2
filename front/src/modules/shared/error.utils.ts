export const extractErrorMessage = (e: unknown): string => {
    if(e instanceof Error){
        return e.message;
    }
    return "Unknown error";
}

export class ApiError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public response?: any
    ) {
      super(message);
    }
  }