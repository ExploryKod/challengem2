import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { ApiError } from "@taotask/modules/shared/error.utils";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HttpClientOptions = {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
};

export class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string = API_CONFIG.baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const fetchOptions: RequestInit = {
            method: options?.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers
            },
            ...(options?.body && { body: JSON.stringify(options.body) })
        };

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new ApiError(
                `Failed to ${options?.method || 'GET'} ${endpoint}: ${response.statusText}`,
                response.status,
                errorData
            );
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return await response.json();
    }

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body });
    }

    put<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body });
    }

    delete<T = void>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}
