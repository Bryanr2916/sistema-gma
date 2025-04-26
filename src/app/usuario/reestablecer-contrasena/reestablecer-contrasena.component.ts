import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './reestablecer-contrasena.component.html',
  styleUrls: ['./reestablecer-contrasena.component.scss']
})
export class ReestablecerContrasenaComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  correo = "";

  constructor(
    private titleService: Title,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Reestablecer contraseña");
  }

  definirFormulario() {
      this.formulario = this.fb.group({
        correo: ["", [Validators.required, Validators.email]]
      });
    }

    errorEnControlador (controlador: string, error: string) {
      return (
        this.formulario.controls[controlador].hasError(error) && 
        this.formulario.controls[controlador].invalid &&
        (this.formulario.controls[controlador].touched)
      );
    }

  reestablecerContrasenna () {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      this.correo = this.formulario.controls["correo"].value;
      this.usuarioService.reestablecerContrasena(this.correo).then(respuesta => {
        this.toastr.success("Correo enviado", "Reestablecer contraseña", {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      }).catch(error => {
        this.toastr.error("Correo inválido", "Error", {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
    }
  }

}
