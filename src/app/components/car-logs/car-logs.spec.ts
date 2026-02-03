import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLogs } from './car-logs';

describe('CarLogs', () => {
  let component: CarLogs;
  let fixture: ComponentFixture<CarLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
