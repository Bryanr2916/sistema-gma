import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ESTADOS_PERMISO, TIPOS_PERMISO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { filtrarListado } from 'src/app/core/utils/filtros';

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
  /** Opciones del filtro de empresa, derivadas de `empresasMap`. */
  opcionesEmpresa: any[] = [];
  tipos: any[] = TIPOS_PERMISO;
  estados = ESTADOS_PERMISO;
  /** Opciones del filtro de vencimiento (las fechas se calculan con `diasRestantes`). */
  opcionesVencimiento = [
    { key: '30', label: 'Próximos 30 días' },
    { key: '60', label: 'Próximos 60 días' },
    { key: '90', label: 'Próximos 90 días' },
    { key: 'vencido', label: 'Ya vencidos' }
  ];
  /** Filtros del listado: null = "Todos". */
  filtroTipo: string | null = null;
  filtroEstado: string | null = null;
  filtroVencimiento: string | null = null;
  filtroEmpresa: string | null = null;
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
      this.opcionesEmpresa = empresas.map(e => ({ key: e.id, label: e.nombre }));

      this.unsubscribe =
        this.permisosService.obtenerTodosLosPermisos(
          permisos => {
            this.permisosTodos = permisos;
            // El snapshot puede dispararse tras borrar/crear: reaplica búsqueda y filtros.
            this.aplicarListado();
            this.cargando = false;
          }
        );
    });
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }

  buscar(event: any) {
    this.busqueda = event;
    this.aplicarListado();
  }

  /** Pipeline único: búsqueda de texto + filtros (AND) sobre el listado completo. */
  private aplicarListado(): void {
    this.permisosFiltrados = filtrarListado(
      this.permisosTodos,
      this.busqueda,
      permiso => [permiso.nombre, this.obtenerNombreEmpresa(permiso.empresaId)],
      [
        this.filtroTipo == null ? null : (permiso: any) => permiso.tipo === this.filtroTipo,
        this.filtroEstado == null ? null : (permiso: any) =>
          this.obtenerEstado(permiso.estado).key === this.filtroEstado,
        this.filtroVencimiento == null ? null : (permiso: any) =>
          this.pasaFiltroVencimiento(permiso, this.filtroVencimiento!),
        this.filtroEmpresa == null ? null : (permiso: any) =>
          permiso.empresaId === this.filtroEmpresa
      ]
    );
    // La barra de acciones no debe apuntar a una fila que ya no está.
    this.filaSeleccionada = -1;
  }

  private pasaFiltroVencimiento(permiso: any, filtro: string): boolean {
    const dias = this.diasRestantes(permiso.fechaVencimiento);
    if (filtro === 'vencido') {
      return dias < 0;
    }
    return dias >= 0 && dias <= Number(filtro);
  }

  cambiarFiltroTipo(valor: string | null): void {
    this.filtroTipo = valor;
    this.aplicarListado();
  }

  cambiarFiltroEstado(valor: string | null): void {
    this.filtroEstado = valor;
    this.aplicarListado();
  }

  cambiarFiltroVencimiento(valor: string | null): void {
    this.filtroVencimiento = valor;
    this.aplicarListado();
  }

  cambiarFiltroEmpresa(valor: string | null): void {
    this.filtroEmpresa = valor;
    this.aplicarListado();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroTipo = null;
    this.filtroEstado = null;
    this.filtroVencimiento = null;
    this.filtroEmpresa = null;
    this.aplicarListado();
  }

  get hayFiltrosActivos(): boolean {
    return !!this.busqueda || this.filtroTipo != null ||
      this.filtroEstado != null || this.filtroVencimiento != null ||
      this.filtroEmpresa != null;
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
    this.router.navigate([`/admin/permisos/ver/${permiso.id}`]);
  }
}
