import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  areaLegal = { nombre:"" };

  constructor(
    private titleService: Title,
    private areaService: AreaLegalService,
    private mensajesService: MensajesService,
    private router: Router, public fb: FormBuilder ) {
      this.definirFormulario();
    }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
  }

  definirFormulario() {
      this.formulario = this.fb.group({
        nombre: ["", [Validators.required]]
      });
    }
  
  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  crearArea() {
    this.formulario.markAllAsTouched();
    if(this.formulario.valid) {

      this.areaLegal.nombre = this.formulario.controls["nombre"].value;

      this.areaService.crearArea(
        this.areaLegal
      ).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Área creada con éxito", undefined);
        this.router.navigate(["/area-legal"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
