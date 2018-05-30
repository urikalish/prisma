import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismButtonComponent } from './prism-button.component';

describe('PrismButtonComponent', () => {
  let component: PrismButtonComponent;
  let fixture: ComponentFixture<PrismButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
