export interface ServiceLog {
  id: number;
  client_id: number;
  car_id: number;
  log_number: number;
  event: string;
  event_time: string | null;
  document_id: string;
}
