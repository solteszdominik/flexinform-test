export interface ServiceLog {
  id: number;
  client_id: number;
  car_id: number;
  lognumber: number;
  event: string;
  event_time: string | null;
  document_id: string;
}
