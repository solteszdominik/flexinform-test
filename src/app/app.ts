import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ClientList } from './components/client-list/client-list';
import { Client } from './models/client.model';
import { Car } from './models/car.model';
import { SearchForm } from './components/search-form/search-form';
import { ClientSearchResult } from './models/client-search.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ClientList, SearchForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('flexinform-test');

  selectedClient = signal<Client | null>(null);
  selectedCar = signal<Car | null>(null);
  autoOpenFirstCar = signal(false);

  onClientSelected(c: Client): void {
    this.selectedClient.set(c);
    this.selectedCar.set(null);
    this.autoOpenFirstCar.set(false);
  }

  onSearchFound(r: ClientSearchResult): void {
    const c: Client = { id: r.id, name: r.name, card_number: r.card_number };

    this.selectedClient.set(c);
    this.selectedCar.set(null);
    this.autoOpenFirstCar.set(true);
  }

  onCarSelected(car: Car): void {
    this.selectedCar.set(car);
    this.autoOpenFirstCar.set(false);
  }
}
