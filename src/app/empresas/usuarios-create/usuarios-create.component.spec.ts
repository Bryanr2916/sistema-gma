import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosCreateComponent } from './usuarios-create.component';

describe('UsuariosCreateComponent', () => {
  let component: UsuariosCreateComponent;
  let fixture: ComponentFixture<UsuariosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
