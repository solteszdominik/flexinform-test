import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../services/api.service';
import { ServiceLog } from '../../models/service-log.model';

@Component({
  selector: 'app-car-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-logs.html',
  styleUrl: './car-logs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarLogs {
  private api = inject(ApiService);

  clientId = input.required<number>();
  carId = input.required<string>();
  registered = input.required<string>();

  logs = signal<ServiceLog[]>([]);

  constructor() {
    effect(() => {
      const clientId = this.clientId();
      const carId = this.carId();

      this.api.getCarServices(clientId, carId).subscribe((logs) => {
        this.logs.set(logs);
      });
    });
  }

  displayEventTime(l: ServiceLog): string {
    if (l.event === 'regisztralt' && !l.event_time) return this.registered();
    return l.event_time ?? '';
  }
}
