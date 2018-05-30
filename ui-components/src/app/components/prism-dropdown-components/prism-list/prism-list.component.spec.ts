import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismListComponent } from './prism-list.component';

describe('PrismListComponent', () => {
  let component: PrismListComponent;
  let fixture: ComponentFixture<PrismListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
