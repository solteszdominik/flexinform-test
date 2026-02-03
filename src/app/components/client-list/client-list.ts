import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  clients$!: Observable<Client[]>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.clients$ = this.api.getClients().pipe(map((res) => res.data));
  }

  selectClient(c: Client): void {
    console.log('selected client', c);
  }
}
