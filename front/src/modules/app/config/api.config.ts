export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    isApiAvailable: () => {
        const url = process.env.NEXT_PUBLIC_API_URL || '';
        return url.trim() !== '';
    }
}