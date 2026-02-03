import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  concatMap,
  forkJoin,
  from,
  map,
  of,
  reduce,
  switchMap,
} from 'rxjs';

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

  /**
   * The test backend may return HTTP 500 for some valid name searches.
   * This fallback searches in the paginated /clients list and then computes
   * the required counts (car_count, service_count) via the existing endpoints.
   */
  searchClientSafe(body: ClientSearchRequest): Observable<ClientSearchResult[]> {
    return this.searchClient(body).pipe(
      catchError((err) => {
        if (err?.status === 500) return this.searchClientFallback(body);
        throw err;
      }),
    );
  }

  getClientCars(clientId: number): Observable<Car[]> {
    return this.http.get<Car[]>(ENDPOINTS.clientCars(clientId));
  }

  getCarServices(clientId: number, carId: string): Observable<ServiceLog[]> {
    return this.http.get<ServiceLog[]>(ENDPOINTS.carServices(clientId, carId));
  }

  private computeSummary(client: Client): Observable<ClientSearchResult> {
    return this.getClientCars(client.id).pipe(
      switchMap((cars) => {
        if (cars.length === 0) {
          return of({
            id: client.id,
            name: client.name,
            card_number: client.card_number,
            car_count: 0,
            service_count: 0,
          });
        }

        return forkJoin(
          cars.map((car) =>
            this.getCarServices(client.id, car.car_id).pipe(map((logs) => logs.length)),
          ),
        ).pipe(
          map((counts) => ({
            id: client.id,
            name: client.name,
            card_number: client.card_number,
            car_count: cars.length,
            service_count: counts.reduce((a, b) => a + b, 0),
          })),
        );
      }),
    );
  }

  private searchClientFallback(req: ClientSearchRequest): Observable<ClientSearchResult[]> {
    // Conservative page cap to avoid endless requests if the backend grows.
    const perPage = 50;
    const maxPages = 20;
    const pages = Array.from({ length: maxPages }, (_, i) => i + 1);

    return from(pages).pipe(
      concatMap((page) => this.getClients(page, perPage).pipe(map((r) => r.data))),
      reduce((all, pageClients) => all.concat(pageClients), [] as Client[]),
      map((allClients) => {
        if (req.card_number) {
          return allClients.filter((c) => c.card_number === req.card_number);
        }
        const q = (req.name ?? '').toLowerCase();
        return allClients.filter((c) => c.name.toLowerCase().includes(q));
      }),
      switchMap((matches) => {
        if (matches.length === 0) return of([] as ClientSearchResult[]);
        return forkJoin(matches.map((c) => this.computeSummary(c)));
      }),
    );
  }
}
