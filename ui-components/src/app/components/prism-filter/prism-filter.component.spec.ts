import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismFilterComponent } from './prism-filter.component';

describe('PrismFilterComponent', () => {
  let component: PrismFilterComponent;
  let fixture: ComponentFixture<PrismFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
