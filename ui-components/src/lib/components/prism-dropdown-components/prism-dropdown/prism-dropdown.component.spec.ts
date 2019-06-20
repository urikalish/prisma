import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismDropdownMenuComponent } from './prism-dropdown.component';

describe('PrismDropdownMenuComponent', () => {
  let component: PrismDropdownMenuComponent;
  let fixture: ComponentFixture<PrismDropdownMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismDropdownMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
