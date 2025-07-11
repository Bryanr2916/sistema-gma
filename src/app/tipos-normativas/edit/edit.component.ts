import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  tipoNormativas = { nombre:"", id: "" };

  constructor(
    private titleService: Title,
    private tiposService: TiposNormativasService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute, public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Tipos de normativas");
    this.route.params.subscribe( params => {
      this.tipoNormativas.id = params["id"];
    });
    this.tiposService.obtenerTipo(this.tipoNormativas.id).then( respuesta => {
      // id no existente
      if (! respuesta.data()) {
        this.toastr.info("El tipo de normativa no existe en el sistema", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["/tipos-normativas"]);
      }
      this.formulario.controls["nombre"].setValue(respuesta.get("nombre"));
    });
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

  editarTipo() {
    this.formulario.markAllAsTouched();
    if(this.formulario.valid) {

      this.tipoNormativas.nombre = this.formulario.controls["nombre"].value;

      this.tiposService.editarTipo(
        this.tipoNormativas
      ).then(_ => {
        this.toastr.success("Tipo de normativas editado con éxito", undefined, {
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
