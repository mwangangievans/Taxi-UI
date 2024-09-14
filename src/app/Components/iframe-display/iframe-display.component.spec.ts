import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeDisplayComponent } from './iframe-display.component';

describe('IframeDisplayComponent', () => {
  let component: IframeDisplayComponent;
  let fixture: ComponentFixture<IframeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IframeDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IframeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
