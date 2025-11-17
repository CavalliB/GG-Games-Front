// Centraliza la URL del backend. Se puede sobrescribir con Vite env var VITE_API_URL
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
