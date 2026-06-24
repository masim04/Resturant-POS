/** Delivery fee in GBP — keep in sync across cart and checkout UI */
export const DELIVERY_CHARGE_RS = 3;

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = `${API_BASE}/api`;
export const assetUrl = (path) => `${API_BASE}${path}`;
