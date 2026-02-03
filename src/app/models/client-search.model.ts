export interface ClientSearchRequest {
  name?: string;
  card_number?: string;
}

export interface ClientSearchResult {
  id: number;
  name: string;
  card_number: string;
  car_count: number;
  service_count: number;
}
