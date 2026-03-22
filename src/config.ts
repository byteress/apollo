export const FB_ACCESS_TOKEN: string =
  (import.meta.env.VITE_FB_ACCESS_TOKEN as string | undefined) ?? '';

export const BACKEND_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? 'http://localhost:8000';
