import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ESTADOS_PERMISO, TIPOS_PERMISO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-admin-permisos-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class AdminPermisosIndexComponent implements OnInit, OnDestroy {

  private unsubscribe?: () => void;
  cargando = true;
  busqueda = "";
  ths = ["#", "Nombre", "Empresa", "Tipo", "Vence", "Archivo", "Estado"];
  permisosTodos: any[] = [];
  permisosFiltrados: any[] = [];
  empresasMap: Map<string, string> = new Map();
  tipos: any[] = TIPOS_PERMISO;
  estados = ESTADOS_PERMISO;
  filaSeleccionada = -1;

  constructor(
    private titleService: Title,
    private permisosService: PermisosService,
    private empresasService: EmpresasService,
    private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Permisos");

    this.empresasService.obtenerEmpresas().subscribe(empresas => {
      this.empresasMap.clear();
      empresas.forEach(e => this.empresasMap.set(e.id, e.nombre));

      this.unsubscribe =
        this.permisosService.obtenerTodosLosPermisos(
          permisos => {
            this.permisosTodos = permisos;
            this.permisosFiltrados = permisos;
            this.cargando = false;
          }
        );
    });
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }

  buscar(event: any) {
    const busquedaMinuscula = event.toLowerCase();
    this.permisosFiltrados = this.permisosTodos.filter(permiso =>
      permiso.nombre.toLowerCase().includes(busquedaMinuscula) ||
      this.obtenerNombreEmpresa(permiso.empresaId).toLowerCase().includes(busquedaMinuscula)
    );
  }

  obtenerNombreEmpresa(empresaId: string): string {
    return this.empresasMap.get(empresaId) || "Sin empresa";
  }

  diasRestantes(fechaVencimiento: string) {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);

    hoy.setHours(12, 0, 0, 0);
    vencimiento.setHours(12, 0, 0, 0);

    const diferenciaMilisegundos = vencimiento.getTime() - hoy.getTime();
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const dias = diferenciaMilisegundos / milisegundosPorDia;

    return Math.round(dias);
  }

  obtenerTipo(tipo: string) {
    return this.tipos.find(tp => tp.key === tipo);
  }

  obtenerEstado(estado: string) {
    const estadoActual = this.estados.find(es => es.key === estado);
    return estadoActual || this.estados[this.estados.length - 1];
  }

  seleccionarFila(event: Event, index: number) {
    event.stopPropagation();
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.filaSeleccionada = index;
    } else {
      this.filaSeleccionada = -1;
    }
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      if (confirm("¿Desea borrar el permiso?")) {
        const permiso = this.permisosFiltrados[this.filaSeleccionada];

        this.permisosService.borrarPermiso(permiso.id).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Permiso borrado con éxito", undefined);
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
  }

  duplicarFila() {
    if (this.filaSeleccionada !== -1) {
      if (confirm("¿Desea duplicar el permiso?\nEl archivo adjunto no será duplicado")) {
        const permiso = { ...this.permisosFiltrados[this.filaSeleccionada], urlArchivo: "" };

        this.permisosService.crearPermiso(permiso).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Permiso duplicado con éxito", undefined);
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
  }

  editarFila() {
    if (this.filaSeleccionada !== -1) {
      const permiso = this.permisosFiltrados[this.filaSeleccionada];
      this.router.navigate([`/admin/permisos/editar/${permiso.id}`]);
    }
  }

  verPermiso(index: number) {
    const permiso = this.permisosFiltrados[index];
    this.router.navigate([`/admin/permisos/view/${permiso.id}`]);
  }
}
