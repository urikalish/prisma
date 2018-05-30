import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismListItemComponent } from './prism-list-item.component';

describe('PrismListItemComponent', () => {
  let component: PrismListItemComponent;
  let fixture: ComponentFixture<PrismListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
