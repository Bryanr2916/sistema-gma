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

  usuario: any = {};
  constructor(
    private usuarioService: UsuarioService, private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.usuarioActual().subscribe( usuarioActivo => {
      if (usuarioActivo) { 
        console.log(usuarioActivo);
        this.usuarioService.usuarioActualFS(usuarioActivo.uid).then(respuseta => {
          console.log(respuseta.docs[0].data());
          const usuarioUID = respuseta.docs[0].data();
          if ( usuarioUID) {
            this.usuario = usuarioUID
          }
        });
      } else {
        this.usuario.correo = "";
      }
    })
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
