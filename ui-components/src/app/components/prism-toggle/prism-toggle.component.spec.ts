import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismToggleComponent } from './prism-toggle.component';

describe('PrismToggleComponent', () => {
  let component: PrismToggleComponent;
  let fixture: ComponentFixture<PrismToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
