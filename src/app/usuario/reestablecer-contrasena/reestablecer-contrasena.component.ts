import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './reestablecer-contrasena.component.html',
  styleUrls: ['./reestablecer-contrasena.component.scss']
})
export class ReestablecerContrasenaComponent implements OnInit {

  correo = "";

  constructor(
    private titleService: Title,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Reestablecer contraseña");
  }

  reestablecerContrasenna () {
    if (this.correo !== "") {
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
