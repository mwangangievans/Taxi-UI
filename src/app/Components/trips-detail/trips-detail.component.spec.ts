import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsDetailComponent } from './trips-detail.component';

describe('TripsDetailComponent', () => {
  let component: TripsDetailComponent;
  let fixture: ComponentFixture<TripsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
