import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  cargando = false;
  formulario: FormGroup = this.fb.group({});
  matriz = {
    empresa: "",
    titulo: ""
  }

  usuario: any = {};

  constructor(
    private titleService: Title,
    private matricesService: MatricesService,
    private mensajesService: MensajesService,
    private router: Router, public fb: FormBuilder,
    private usuarioService: UsuarioService
    ) {
      this.definirFormulario();
    }

  definirFormulario() {
    this.formulario = this.fb.group({
      titulo: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.cargando = false;
    });
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  crearMatriz() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {

      this.matriz.empresa = this.usuario.empresaId;
      this.matriz.titulo = this.formulario.controls["titulo"].value;

      this.matricesService.crearMatriz(this.matriz).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Matriz creada con éxito", undefined);
        this.router.navigate(["matrices"]);
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.scrollCampoRequeridoInvalido();
    }
  }

  private scrollCampoRequeridoInvalido() {
    const elemento = document.getElementById('fieldTitulo');
    elemento?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const input = elemento?.querySelector('input') as HTMLElement;
    input?.focus();
  }
}
