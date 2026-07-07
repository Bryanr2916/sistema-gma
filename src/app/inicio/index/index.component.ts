import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  usuario: any = {};
  private readonly menuBase = [
    {logo:"user", nombre: "Perfil de Usuario", enlace: "usuario/perfil"}
  ];
  menu = [...this.menuBase];

  constructor(private titleService: Title, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Inicio");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.cargando = false;

      const menuActualizado = [...this.menuBase];
      if (this.usuario.tipo == TIPOS_USUARIO.adminSistema) {
        menuActualizado.unshift({ logo: "table-cells", nombre: "Matrices", enlace: "admin/matrices" });
        menuActualizado.unshift({ logo: "briefcase", nombre: "Empresas", enlace: "empresas" });
        menuActualizado.push({ logo: "book", nombre: "Normativas", enlace: "normativas" });
        menuActualizado.push({ logo: "rectangle-list", nombre: "Tipos de Normativas", enlace: "tipos-normativas" });
        menuActualizado.push({ logo: "bookmark", nombre: "Área Legal", enlace: "area-legal" });
        menuActualizado.push({ logo: "recycle", nombre: "Riesgos Ambientales", enlace: "admin/riesgos-ambientales" });
        menuActualizado.push({ logo: "bell", nombre: "Permisos", enlace: "admin/permisos" });
      }

      if (this.usuario.tipo == TIPOS_USUARIO.admin || this.usuario.tipo === TIPOS_USUARIO.editor || this.usuario.tipo === TIPOS_USUARIO.lector) {
        menuActualizado.unshift({ logo: "table-cells", nombre: "Matrices", enlace: "matrices" });
      }

      if (this.usuario.tipo == TIPOS_USUARIO.admin) {
        menuActualizado.unshift({ logo: "briefcase", nombre: "Empresa Detalle", enlace: "empresa/detalle" });
        menuActualizado.unshift({ logo: "users", nombre: "Gestionar Usuarios", enlace: "empresa/gestionar-usuarios" });
      }

      if (this.usuario.tipo == TIPOS_USUARIO.admin || this.usuario.tipo === TIPOS_USUARIO.editor) {
        menuActualizado.push({ logo: "recycle", nombre: "Riesgos Ambientales", enlace: "riesgos-ambientales" });
        menuActualizado.push({ logo: "bell", nombre: "Permisos", enlace: "permisos" })
      }

      this.menu = menuActualizado;
    });
  }

}
