export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    isApiAvailable: () => {
        const forceDemo = (process.env.NEXT_PUBLIC_FORCE_DEMO || '').toLowerCase() === 'true';
        if (forceDemo) {
            return false;
        }
        const url = process.env.NEXT_PUBLIC_API_URL || '';
        return url.trim() !== '';
    }
}