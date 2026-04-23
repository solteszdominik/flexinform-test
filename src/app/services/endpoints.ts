export const API_BASE = 'https://carservice-backend-test.flexinform.hu/api';

export const ENDPOINTS = {
  clients: `${API_BASE}/clients`,
  clientCars: (clientId: number) => `${API_BASE}/clients/${clientId}/cars`,
  clientSearch: `${API_BASE}/clients/search`,
  carServices: (clientId: number, carId: string) =>
    `${API_BASE}/clients/${clientId}/cars/${carId}/services`,
} as const;
