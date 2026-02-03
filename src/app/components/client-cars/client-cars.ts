import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { ApiService } from '../../services/api.service';
import { Car } from '../../models/car.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-cars.html',
  styleUrl: './client-cars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCars {
  private api = inject(ApiService);

  clientId = input.required<number>();
  autoSelectFirst = input(false);

  carSelected = output<Car>();

  cars = signal<Car[]>([]);
  private didAutoSelectForClientId = signal<number | null>(null);

  constructor() {
    effect(() => {
      const id = this.clientId();

      this.cars.set([]);
      this.didAutoSelectForClientId.set(null);

      this.api.getClientCars(id).subscribe((cars) => {
        this.cars.set(cars);

        if (this.autoSelectFirst() && cars.length > 0 && this.didAutoSelectForClientId() !== id) {
          this.didAutoSelectForClientId.set(id);
          this.selectCar(cars[0]);
        }
      });
    });
  }

  selectCar(car: Car): void {
    this.carSelected.emit(car);
  }
}
