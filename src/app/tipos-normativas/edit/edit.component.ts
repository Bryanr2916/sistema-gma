import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from 'src/app/core/services/mensajes.service';
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
    private mensajesService: MensajesService,
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
      if (!respuesta.data()) {
        this.mensajesService.mostrarMensaje("info", "El tipo de normativa no existe en el sistema", undefined);
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
        this.mensajesService.mostrarMensaje("success", "Tipo de normativas editado con éxito", undefined);
        this.router.navigate(["/tipos-normativas"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }

}
