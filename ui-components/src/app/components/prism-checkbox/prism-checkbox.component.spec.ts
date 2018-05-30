import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismCheckboxComponent } from './prism-checkbox.component';

describe('PrismCheckboxComponent', () => {
  let component: PrismCheckboxComponent;
  let fixture: ComponentFixture<PrismCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
