import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  usuario = {
    correo: "",
    contrasena: ""
  }
  constructor(
    private titleService: Title, private usuarioService: UsuarioService,
    private router: Router, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Inicio de sesión");
  }
  
  iniciarSesion(event: any) {
    this.usuarioService.iniciarSesion(this.usuario).then( respuesta => {
      this.router.navigate([""]);
      this.toastr.success("Bienvenido(a) a GMA Sistema", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
    }).catch( _ => {
      this.toastr.error("Credenciales inválidas", "Error al iniciar sesión", {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
    });
  }

}
