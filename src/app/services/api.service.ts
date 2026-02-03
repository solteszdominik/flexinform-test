import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENDPOINTS } from './endpoints';

import { PaginatedResponse } from '../models/paginated-response.model';
import { Client } from '../models/client.model';
import { ClientSearchRequest, ClientSearchResult } from '../models/client-search.model';
import { Car } from '../models/car.model';
import { ServiceLog } from '../models/service-log.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getClients(page = 1, perPage = 15): Observable<PaginatedResponse<Client>> {
    return this.http.get<PaginatedResponse<Client>>(ENDPOINTS.clients, {
      params: { page, per_page: perPage },
    });
  }

  searchClient(body: ClientSearchRequest): Observable<ClientSearchResult[]> {
    return this.http.post<ClientSearchResult[]>(ENDPOINTS.clientSearch, body);
  }

  getClientCars(clientId: number): Observable<Car[]> {
    return this.http.get<Car[]>(ENDPOINTS.clientCars(clientId));
  }

  getCarServices(clientId: number, carId: string): Observable<ServiceLog[]> {
    return this.http.get<ServiceLog[]>(ENDPOINTS.carServices(clientId, carId));
  }
}
