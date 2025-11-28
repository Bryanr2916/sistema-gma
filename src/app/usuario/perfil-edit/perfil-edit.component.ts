import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil-edit.component.html',
  styleUrls: ['./perfil-edit.component.scss']
})
export class PerfilEditComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  tipos: any = [];
  usuario: any = {};

  constructor(private titleService: Title, public fb: FormBuilder, private usuarioService: UsuarioService,
    private mensajesService: MensajesService, private router: Router
  ) {
    this.tipos = usuarioService.tiposSelectPerfil();
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Perfil");
    this.obtenerUsuario();
  }

  async obtenerUsuario() {
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.formulario.controls["nombre"].setValue(this.usuario.nombre);
      this.formulario.controls["correo"].setValue(this.usuario.correo);
      this.formulario.controls["tipo"].setValue(this.usuario.tipo);

      this.formulario.controls["correo"].disable();
      this.formulario.controls["tipo"].disable();
    });
  }

  definirFormulario() {
      this.formulario = this.fb.group(
        {
          nombre: ["", [Validators.required]],
          correo: ["", [Validators.required, Validators.email]],
          tipo: [0, [Validators.required, seleccionVacia()]],
        }
      );
    }

  errorEnControlador(controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) &&
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  editarPerfil() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      this.usuario.nombre = this.formulario.controls["nombre"].value;

      this.usuarioService.editarUsuario(this.usuario).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Perfil editado con éxito", undefined);
        this.router.navigate(["/usuario/perfil"]);
      });
    }
  }

}
