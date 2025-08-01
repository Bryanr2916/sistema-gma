import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

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

  empresas: any[] = [];

  usuario: any = {};

  constructor(
    private titleService: Title,
    private empresaService: EmpresasService,
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
      titulo: ["", [Validators.required]],
      empresa: ["", [Validators.required, seleccionVacia()]]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.route.params.subscribe( params => {
      this.matriz.id = params["id"];
    });

    this.usuarioService.usuarioActual().subscribe( usuarioActivo => {
      if (usuarioActivo) { 
        this.usuarioService.usuarioActualFS(usuarioActivo.uid).then(respuesta => {
          const usuarioFS = respuesta.docs[0];
          if (usuarioFS) {
            const usuarioUID = respuesta.docs[0].data();
            if (usuarioUID) {
              this.usuario = usuarioUID
              this.empresaService.obtenerEmpresas().subscribe(datos => {
                this.empresas = datos;
                if (this.usuario.tipo === 2) {
                  this.formulario.get("empresa")?.disable();
                } 

                this.matricesService.obtenerMatriz(this.matriz.id).then(respuesta => {
                  this.formulario.controls["titulo"].setValue(respuesta.get("titulo"));
                  this.formulario.controls["empresa"].setValue(respuesta.get("empresa"));
                  this.matriz.titulo = respuesta.get("titulo");
                  this.matriz.empresa = respuesta.get("empresa");
                });

                this.cargando = false;
              });
            }
          }
        });
      } else {
        this.usuario.correo = "";
      }
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

      this.matriz.empresa = this.formulario.controls["empresa"].value;
      this.matriz.titulo = this.formulario.controls["titulo"].value;

      this.matricesService.editarMatriz(
        this.matriz
      ).then(data => {
        console.log(data);
        this.mensajesService.mostrarMensaje("success", "Matriz editada con éxito", undefined);
        this.router.navigate(["/matrices"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
