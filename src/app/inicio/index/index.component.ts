import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  usuario: any = {};
  menu = [
    {logo:"table-cells", nombre: "Matrices", enlace: "matrices"},
    {logo:"user", nombre: "Perfil de Usuario", enlace: "usuario/perfil"}
  ];

  constructor(private titleService: Title, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Inicio");
    this.usuarioService.usuarioActual().subscribe( usuarioActivo => {
      if (usuarioActivo) { 
        this.usuarioService.usuarioActualFS(usuarioActivo.uid).then(respuseta => {
          const usuarioFS = respuseta.docs[0];
          if (usuarioFS) {
            const usuarioUID = respuseta.docs[0].data();
          if ( usuarioUID) {
            this.usuario = usuarioUID
            this.cargando = false;
            if (this.usuario.tipo == 1) {
              this.menu.unshift({logo:"briefcase", nombre: "Empresas", enlace: "empresas"});
              this.menu.push({logo:"book", nombre: "Normativas", enlace: "normativas"});
              this.menu.push({logo:"rectangle-list", nombre: "Tipos de Normativas", enlace: "tipos-normativas"});
              this.menu.push({logo:"bookmark", nombre: "Área Legal", enlace: "area-legal"});
            }

            if (this.usuario.tipo == 2) {
              this.menu.unshift({logo: "users", nombre: "Gestionar Usuarios", enlace: "empresa/gestionar-usuarios"});
            }
          }
          }
        });
      } else {
        this.usuario.correo = "";
      }
    });
  }

}
