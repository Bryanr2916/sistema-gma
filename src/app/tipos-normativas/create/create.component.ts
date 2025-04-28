import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  
  formulario: FormGroup = this.fb.group({});
  tipoNormativas = { nombre: "" };

  constructor(
    private titleService: Title,
    private tiposService: TiposNormativasService,
    private toastr: ToastrService,
    private router: Router, public fb: FormBuilder ) {
      this.definirFormulario();
    }


  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Tipos de normativas");
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

  crearTipo() {
    this.formulario.markAllAsTouched();
    if(this.formulario.valid) {

      this.tipoNormativas.nombre = this.formulario.controls["nombre"].value;

      this.tiposService.crearTipo(
        this.tipoNormativas
      ).then(() => {
        this.toastr.success("Tipo de normativas creada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["/tipos-normativas"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }

}
