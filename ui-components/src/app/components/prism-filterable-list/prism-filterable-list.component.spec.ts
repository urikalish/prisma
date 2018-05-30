import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismFilterableListComponent } from './prism-filterable-list.component';

describe('PrismFilterableListComponent', () => {
  let component: PrismFilterableListComponent;
  let fixture: ComponentFixture<PrismFilterableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismFilterableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismFilterableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
