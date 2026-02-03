import { Component, signal } from '@angular/core';
import { ClientCars } from './components/client-cars/client-cars';
import { CarLogs } from './components/car-logs/car-logs';
import { ClientList } from './components/client-list/client-list';
import { Client } from './models/client.model';
import { Car } from './models/car.model';
import { SearchForm } from './components/search-form/search-form';
import { ClientSearchResult } from './models/client-search.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ClientCars, CarLogs, ClientList, SearchForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('flexinform-test');

  selectedClient = signal<Client | null>(null);
  selectedCar = signal<Car | null>(null);

  autoOpenFirstCar = signal(false);

  onClientSelected(c: Client) {
    this.selectedClient.set(c);
    this.selectedCar.set(null);
    this.autoOpenFirstCar.set(false);
  }

  onSearchFound(r: ClientSearchResult) {
    const c: Client = { id: r.id, name: r.name, card_number: r.card_number };

    this.selectedClient.set(c);
    this.selectedCar.set(null);

    this.autoOpenFirstCar.set(true);
  }

  onCarSelected(car: Car) {
    this.selectedCar.set(car);
    this.autoOpenFirstCar.set(false);
  }
}
