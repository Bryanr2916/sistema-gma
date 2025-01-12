import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizArticulosEditComponent } from './matriz-articulos-edit.component';

describe('MatrizArticulosEditComponent', () => {
  let component: MatrizArticulosEditComponent;
  let fixture: ComponentFixture<MatrizArticulosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizArticulosEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizArticulosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
