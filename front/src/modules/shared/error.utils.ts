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

export type ApiFailureKind = 'connection' | 'http' | 'unknown';

const normalizeApiResponseMessage = (response?: unknown): string | null => {
    if (!response || typeof response !== 'object') {
        return null;
    }
    const message = (response as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
        return message.join(', ');
    }
    if (typeof message === 'string') {
        return message;
    }
    return null;
};

export const classifyApiError = (error: unknown): { kind: ApiFailureKind; message: string } => {
    if (error instanceof ApiError) {
        const responseMessage = normalizeApiResponseMessage(error.response);
        return {
            kind: 'http',
            message: responseMessage ?? error.message ?? 'Erreur API',
        };
    }

    if (error instanceof TypeError) {
        return {
            kind: 'connection',
            message: "Impossible de se connecter a l'API",
        };
    }

    return {
        kind: 'unknown',
        message: extractErrorMessage(error),
    };
};