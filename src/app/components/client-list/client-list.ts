import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { Client } from '../../models/client.model';
import { Car } from '../../models/car.model';
import { ClientCars } from '../client-cars/client-cars';
import { CarLogs } from '../car-logs/car-logs';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, ClientCars, CarLogs],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  clients$!: Observable<Client[]>;
  @Input() selectedClient: Client | null = null;
  @Input() selectedCar: Car | null = null;

  @Output() clientSelected = new EventEmitter<Client>();
  @Output() carSelected = new EventEmitter<Car>();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.clients$ = this.api.getClients().pipe(map((res) => res.data));
  }

  selectClient(c: Client): void {
    this.clientSelected.emit(c);
  }
}
