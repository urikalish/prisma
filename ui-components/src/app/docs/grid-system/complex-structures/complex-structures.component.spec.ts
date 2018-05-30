import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexStructuresComponent } from './complex-structures.component';

describe('ComplexStructuresComponent', () => {
  let component: ComplexStructuresComponent;
  let fixture: ComponentFixture<ComplexStructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexStructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
