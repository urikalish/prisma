import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismColorPickerComponent } from './prism-color-picker.component';

describe('PrismColorPickerComponent', () => {
  let component: PrismColorPickerComponent;
  let fixture: ComponentFixture<PrismColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
