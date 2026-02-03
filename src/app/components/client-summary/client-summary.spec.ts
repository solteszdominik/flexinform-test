import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSummary } from './client-summary';

describe('ClientSummary', () => {
  let component: ClientSummary;
  let fixture: ComponentFixture<ClientSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
