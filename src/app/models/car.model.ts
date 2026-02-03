export interface LatestService {
  event: string;
  event_time: string | null;
}

export interface Car {
  id: number;
  client_id: number;
  car_id: string;
  type: string;
  registered: string;
  ownbrand: boolean;
  accidents: number;
  latest_service?: LatestService | null;
}
