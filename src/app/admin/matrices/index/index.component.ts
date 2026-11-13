import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { filtrarListado } from 'src/app/core/utils/filtros';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  tiposUsuario = TIPOS_USUARIO;
  cargando = true;
  busqueda = "";
  empresas:any[] = [];
  matricesTodas:any[] = [];
  matricesFiltradas:any[] = [];
  articulosAplicables: any[] = [];
  ths = ["#","Título","Normativas","Empresa"];
  usuario: any = { };
  /** Opciones del filtro de empresa, derivadas de `empresas`. */
  opcionesEmpresa: any[] = [];
  /** Opciones del filtro de artículos aplicables (estáticas). */
  opcionesArticulos = [
    { key: 'con', label: 'Con artículos aplicables' },
    { key: 'sin', label: 'Sin artículos aplicables' }
  ];
  /** Filtros del listado: null = "Todos". */
  filtroEmpresa: string | null = null;
  filtroArticulos: string | null = null;
  filaSeleccionada = -1;

  constructor(
    private titleService: Title,
    private empresasService: EmpresasService,
    private matricesService: MatricesService,
    private usuarioService: UsuarioService,
    private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.empresasService.obtenerEmpresas().subscribe(datos => {
      this.empresas = datos;
      this.opcionesEmpresa = datos.map(e => ({ key: e.id, label: e.nombre }));
      this.cargarUsuario();
    });
  }

  async cargarUsuario() {
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;

      if (this.usuario.tipo !== this.tiposUsuario.adminSistema) {
        this.ths = this.ths.filter(th => th !== "Empresa");
      }
      this.cargarMatrices();
    });
  }

  async cargarMatrices() {
    // filtrar matrices por empresa
    const filtrarMatrices = this.usuario.tipo !== TIPOS_USUARIO.adminSistema;

    this.matricesService.obtenerMatrices().subscribe(async datos => {
      this.matricesTodas = !filtrarMatrices ?  datos : datos.filter(matriz => matriz.empresa === this.usuario.empresaId);
      this.articulosAplicables = (await this.matricesService.obtenerArticulosAplicables()).docs.map((value) => { return {id: value.id, ...value.data() };});
      // El pipeline depende de `articulosAplicables`: se aplica cuando ambas cargas están listas.
      this.aplicarListado();
      this.cargando = false;
    });
  }

  /** Solo el admin de sistema ve la columna (y el filtro) de empresa. */
  get esAdminSistema(): boolean {
    return this.usuario?.tipo === TIPOS_USUARIO.adminSistema;
  }

  nombreEmpresa (id: string) {
    return this.empresas.find(emp => emp.id === id)?.nombre || 'Sin empresa';
  }

  obtenerCantidadArticulosAplicables(matrizId: string) {
    return this.articulosAplicables.filter(aa => {
      return aa.matrizId === matrizId;
    }).length;
  }

  buscar(event: any) {
    this.busqueda = event;
    this.aplicarListado();
  }

  /** Pipeline único: búsqueda de texto + filtros (AND) sobre el listado completo. */
  private aplicarListado(): void {
    this.matricesFiltradas = filtrarListado(
      this.matricesTodas,
      this.busqueda,
      matriz => [matriz.titulo, this.nombreEmpresa(matriz.empresa)],
      [
        this.filtroEmpresa == null ? null : (matriz: any) =>
          matriz.empresa === this.filtroEmpresa,
        this.filtroArticulos == null ? null : (matriz: any) =>
          (this.obtenerCantidadArticulosAplicables(matriz.id) > 0) === (this.filtroArticulos === 'con')
      ]
    );
    // La barra de acciones no debe apuntar a una fila que ya no está.
    this.filaSeleccionada = -1;
  }

  cambiarFiltroEmpresa(valor: string | null): void {
    this.filtroEmpresa = valor;
    this.aplicarListado();
  }

  cambiarFiltroArticulos(valor: string | null): void {
    this.filtroArticulos = valor;
    this.aplicarListado();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroEmpresa = null;
    this.filtroArticulos = null;
    this.aplicarListado();
  }

  get hayFiltrosActivos(): boolean {
    return !!this.busqueda || this.filtroEmpresa != null || this.filtroArticulos != null;
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

  verMatriz(index: number) {
    const matriz = this.matricesFiltradas[index];
    this.router.navigate([`admin/matrices/ver/${matriz.id}`]);
  }

  editarFila() {
    if (this.filaSeleccionada !== -1) {
      const matriz = this.matricesFiltradas[this.filaSeleccionada];
      this.router.navigate([`admin/matrices/editar/${matriz.id}`]);
    }
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      const matriz = this.matricesFiltradas[this.filaSeleccionada];
      if (confirm(`¿Desea eliminar la matriz "${matriz.titulo}"?`)) {
        this.matricesService.borrarMatriz(matriz.id).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Matriz borrada con éxito", undefined);
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
  }

  crearArticulosFila() {
    if (this.filaSeleccionada !== -1) {
      const matriz = this.matricesFiltradas[this.filaSeleccionada];
      this.router.navigate([`admin/matrices/crear-articulos/${matriz.id}`]);
    }
  }

}
