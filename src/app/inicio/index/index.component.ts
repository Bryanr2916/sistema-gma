import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { UsuarioService } from 'src/app/core/services/usuario.service';

interface OpcionMenu {
  logo: string;
  nombre: string;
  enlace: string;
  descripcion: string;
  orden: number;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  usuario: any = {};
  private readonly DESC_MATRICES = "Consulte y actualice los requisitos legales aplicables y su estado de cumplimiento.";
  private readonly DESC_RIESGOS = "Identifique y evalúe los aspectos e impactos ambientales de la operación para determinar sus riesgos.";
  private readonly DESC_PERMISOS = "Supervise permisos y licencias, sus fechas de vencimiento y las alertas de renovación.";
  private readonly menuBase: OpcionMenu[] = [
    { 
      logo: "user", nombre: "Perfil de Usuario", enlace: "usuario/perfil", orden: 10, descripcion: "Administre sus datos personales, credenciales de acceso y preferencias de la cuenta."
    }
  ];
  menu: OpcionMenu[] = [...this.menuBase];

  constructor(private titleService: Title, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Inicio");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;

      const menuActualizado: OpcionMenu[] = [...this.menuBase];
      if (this.usuario.tipo == TIPOS_USUARIO.adminSistema) {
        menuActualizado.push({ logo: "table-cells", nombre: "Matrices", enlace: "admin/matrices", orden: 1, descripcion: this.DESC_MATRICES });
        menuActualizado.push({ logo: "bell", nombre: "Permisos", enlace: "admin/permisos", orden: 2, descripcion: this.DESC_PERMISOS });
        menuActualizado.push({ logo: "recycle", nombre: "Riesgos Ambientales", enlace: "admin/riesgos-ambientales", orden: 3, descripcion: this.DESC_RIESGOS });
        menuActualizado.push({ logo: "briefcase", nombre: "Empresas", enlace: "empresas", orden: 6, descripcion: "Agregue, edite y configure la información de las empresas registradas en el sistema." });
        menuActualizado.push({ logo: "book", nombre: "Normativas", enlace: "normativas", orden: 7, descripcion: "Administre el catálogo de normativas legales aplicables a las organizaciones." });
        menuActualizado.push({ logo: "rectangle-list", nombre: "Tipos de Normativas", enlace: "tipos-normativas", orden: 8, descripcion: "Gestione las categorías con las que se clasifican las normativas del sistema." });
        menuActualizado.push({ logo: "bookmark", nombre: "Área Legal", enlace: "area-legal", orden: 9, descripcion: "Administre las áreas legales que agrupan los requisitos y normativas del sistema." });
      }

      if (this.usuario.tipo == TIPOS_USUARIO.admin || this.usuario.tipo === TIPOS_USUARIO.editor || this.usuario.tipo === TIPOS_USUARIO.lector) {
        menuActualizado.push({ logo: "table-cells", nombre: "Matrices", enlace: "matrices", orden: 1, descripcion: this.DESC_MATRICES });
      }

      if (this.usuario.tipo == TIPOS_USUARIO.admin) {
        menuActualizado.push({ logo: "briefcase", nombre: "Detalle de empresa", enlace: "empresa/detalle", orden: 4, descripcion: "Consulte los datos generales, representantes y configuración de su empresa." });
        menuActualizado.push({ logo: "users", nombre: "Gestionar Usuarios", enlace: "empresa/gestionar-usuarios", orden: 5, descripcion: "Administre los usuarios de su organización: altas, roles y permisos de acceso." });
      }

      if (this.usuario.tipo == TIPOS_USUARIO.admin || this.usuario.tipo === TIPOS_USUARIO.editor) {
        menuActualizado.push({ logo: "recycle", nombre: "Riesgos Ambientales", enlace: "riesgos-ambientales", orden: 3, descripcion: this.DESC_RIESGOS });
        menuActualizado.push({ logo: "bell", nombre: "Permisos", enlace: "permisos", orden: 2, descripcion: this.DESC_PERMISOS });
      }

      this.menu = menuActualizado.sort((a, b) => a.orden - b.orden);
      this.cargando = false;
    });
  }

}
