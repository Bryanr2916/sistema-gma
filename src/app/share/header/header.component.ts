import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  cerrarSesion() {
    if (confirm("¿Desea cerrar sesión?")) {
      this.usuarioService.cerrarSesion().then(() => {
        this.toastr.success("Ha cerrado sesión de forma exitosa", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["usuario/inicio-sesion"])
      }).catch(error => console.log(error));
    }
  }

}
