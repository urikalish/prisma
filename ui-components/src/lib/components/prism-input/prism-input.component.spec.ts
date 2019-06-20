import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismInputComponent } from './prism-input.component';

describe('PrismInputComponent', () => {
  let component: PrismInputComponent;
  let fixture: ComponentFixture<PrismInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
