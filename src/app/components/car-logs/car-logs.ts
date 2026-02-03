import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { ServiceLog } from '../../models/service-log.model';

@Component({
  selector: 'app-car-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-logs.html',
  styleUrl: './car-logs.scss',
})
export class CarLogs implements OnChanges {
  @Input({ required: true }) clientId!: number;
  @Input({ required: true }) carId!: string; // car.car_id
  @Input({ required: true }) registered!: string; // car.registered

  logs$?: Observable<ServiceLog[]>;

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['clientId'] || changes['carId']) && this.clientId && this.carId) {
      this.logs$ = this.api.getCarServices(this.clientId, this.carId);
    }
  }

  displayEventTime(l: ServiceLog): string {
    if (l.event === 'regisztralt' && !l.event_time) return this.registered;
    return l.event_time ?? '';
  }
}
