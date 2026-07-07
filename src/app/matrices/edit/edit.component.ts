import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  cargando = true;
  formulario: FormGroup = this.fb.group({});
  matriz = {
    empresa: "",
    titulo: "",
    id: ""
  }

  usuario: any = {};

  constructor(
    private titleService: Title,
    private matricesService: MatricesService,
    private mensajesService: MensajesService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
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
    this.route.params.subscribe( params => {
      this.matriz.id = params["id"];
    });

    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;

      this.matricesService.obtenerMatriz(this.matriz.id).then(respuesta => {
        const matrizData = respuesta.data() as any;

        if (matrizData?.empresa !== this.usuario.empresaId) {
          this.mensajesService.mostrarMensaje("error", "Su usuario no tiene permisos para acceder a esta página", "Acceso Denegado");
          this.router.navigate(["/matrices"]);
          return;
        }

        this.formulario.controls["titulo"].setValue(matrizData?.titulo);
        this.matriz.titulo = matrizData?.titulo;
        this.matriz.empresa = matrizData?.empresa;
        this.cargando = false;
      });
    });
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  editarMatriz() {
    this.formulario.markAllAsTouched();
    if(this.formulario.valid) {

      this.matriz.titulo = this.formulario.controls["titulo"].value;

      this.matricesService.editarMatriz(
        this.matriz
      ).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Matriz editada con éxito", undefined);
        this.router.navigate(["/matrices"]);
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
