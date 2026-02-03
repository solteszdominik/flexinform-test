import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { Car } from '../../models/car.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-cars.html',
  styleUrl: './client-cars.scss',
})
export class ClientCars implements OnChanges {
  @Input({ required: true }) clientId!: number;
  @Input() autoSelectFirst = false;

  @Output() carSelected = new EventEmitter<Car>();

  cars$?: Observable<Car[]>;

  // cache, hogy auto-select tudjon futni akkor is, ha csak a flag változik
  private lastCars: Car[] = [];

  // egyszer fusson le clientenként
  private didAutoSelectForClientId: number | null = null;

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // 1) ha clientId változik: töltsük újra az autókat
    if (changes['clientId'] && this.clientId) {
      this.lastCars = [];
      this.didAutoSelectForClientId = null;

      this.cars$ = this.api.getClientCars(this.clientId).pipe(
        tap((cars) => {
          this.lastCars = cars;

          if (
            this.autoSelectFirst &&
            cars.length > 0 &&
            this.didAutoSelectForClientId !== this.clientId
          ) {
            this.didAutoSelectForClientId = this.clientId;
            this.selectCar(cars[0]);
          }
        }),
      );
      return;
    }

    if (changes['autoSelectFirst'] && this.autoSelectFirst) {
      if (
        this.clientId &&
        this.lastCars.length > 0 &&
        this.didAutoSelectForClientId !== this.clientId
      ) {
        this.didAutoSelectForClientId = this.clientId;
        this.selectCar(this.lastCars[0]);
      }
    }
  }

  selectCar(car: Car): void {
    this.carSelected.emit(car);
  }
}
