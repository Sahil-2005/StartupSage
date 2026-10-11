// If VITE_API_BASE_URL is provided (e.g. on Vercel production), use it.
// In local dev without the env var, default to empty string so Vite proxy handles /api.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
