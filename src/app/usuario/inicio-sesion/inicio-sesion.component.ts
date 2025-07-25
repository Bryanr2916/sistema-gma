import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { EncriptadorService } from 'src/app/core/services/encriptador.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  usuario = {
    correo: "",
    contrasena: ""
  }
  constructor(
    private titleService: Title, private usuarioService: UsuarioService,
    private router: Router, private mensajesService: MensajesService, private encriptador: EncriptadorService,
    public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Inicio de sesión");
  }

  definirFormulario() {
    this.formulario = this.fb.group({
      correo: ["", [Validators.required, Validators.email]],
      contrasena: ["", Validators.required]
    });
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  iniciarSesion() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      this.usuario.correo = this.formulario.controls["correo"].value;
      this.usuario.contrasena = this.formulario.controls["contrasena"].value;

      this.usuarioService.iniciarSesion(this.usuario).then( _ => {
        this.router.navigate([""]);
        this.mensajesService.mostrarMensaje("success", "Bienvenido(a) a GMA Sistema", undefined)
      }).catch( _ => {
        this.usuarioService.obtenerUsuarios().pipe(take(1)).subscribe(datos => {
          const usuarioFB = datos.find( dt => dt.correo == this.usuario.correo);
          if (!usuarioFB) {
            this.mensajesService.mostrarMensaje("error", "Correo no registrado en el sistema", "Error al iniciar sesión");
          } else {
            const contrasenaCoincide = this.encriptador.desencriptarContrasena(usuarioFB.contrasena) === this.usuario.contrasena;
            if (!contrasenaCoincide) {
              this.mensajesService.mostrarMensaje("error", "La contraseña no coincide", "Error al iniciar sesión");
            } else {
              this.usuarioService.registrar(this.usuario).then(respuesta => {
                this.usuarioService.obtenerUsuarioPorCorreo(this.usuario.correo).then(oup => {
                  this.usuarioService.editarUsuario({
                    id: oup.docs[0].id,
                    uid: respuesta.user.uid
                  });
                });
                this.router.navigate([""]);
                this.mensajesService.mostrarMensaje("success", "Bienvenido(a) a GMA Sistema", undefined)
              });
            }
          }
  
        });
      });
    }
  }

}
