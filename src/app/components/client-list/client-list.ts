import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  input,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientList implements OnInit {
  private api = inject(ApiService);

  selectedClient = input<Client | null>(null);
  selectedCar = input<Car | null>(null);

  clientSelected = output<Client>();
  carSelected = output<Car>();

  clients = signal<Client[]>([]);

  ngOnInit(): void {
    this.api.getClients().subscribe((res) => {
      this.clients.set(res.data);
    });
  }

  selectClient(c: Client): void {
    this.clientSelected.emit(c);
  }
}
