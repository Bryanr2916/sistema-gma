import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { EncriptadorService } from 'src/app/core/services/encriptador.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { filtrarListado } from 'src/app/core/utils/filtros';

@Component({
  selector: 'app-gestionar-usuarios',
  templateUrl: './gestionar-usuarios.component.html',
  styleUrls: ['./gestionar-usuarios.component.scss']
})
export class GestionarUsuariosComponent implements OnInit {

  cargando = true;
  datosListos = false;
  logoListo = false;
  busqueda = "";
  ths = ["#","Nombre", "Correo", "Tipo"];
  usuariosTodos:any[] = [];
  usuariosFiltrados:any[] = [];
  /** Opciones del filtro de tipo: coinciden con `mostrarTipo` (tipo 1 y 2 = Administrador). */
  opcionesTipoUsuario = [
    { key: 'admin', label: 'Administrador' },
    { key: 'editor', label: 'Editor' },
    { key: 'lector', label: 'Lector' }
  ];
  /** Filtro de tipo: null = "Todos". */
  filtroTipo: string | null = null;
  filaSeleccionada = -1;
  usuario: any = {};
  empresa = {
    id: "",
    nombre: ""
  };

  constructor(private titleService: Title, private usuarioService: UsuarioService,
    private empresasService:EmpresasService, private mensajesService: MensajesService,
    private route: ActivatedRoute, private encriptadorService: EncriptadorService, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.empresa.id = usuario?.['empresaId'];

      this.cargarDatos();
    });
  }

  cargarDatos = async () => {
    const reEmpresa = await this.empresasService.obtenerEmpresa(this.empresa.id);
    const datosEmpresa = reEmpresa.data();

    if (datosEmpresa) {
      this.empresa.nombre = datosEmpresa['nombre']; 
    } else {
      //todo: empresa no existe
    }

    const reUsuarios = await this.usuarioService.obtenerUsuarioPorEmpresa(this.empresa.id);

    if (reUsuarios) {
      this.usuariosTodos = reUsuarios.docs.map(usDoc => (
        {...usDoc.data(), id: usDoc.id}
      ));
      this.aplicarListado();
      this.datosListos = true;
      this.verificarListo();
    }
  };

  onLogoListo(): void {
    this.logoListo = true;
    this.verificarListo();
  }

  private verificarListo(): void {
    if (this.datosListos && this.logoListo) {
      this.cargando = false;
    }
  }

  buscar(event: any) {
    this.busqueda = event;
    this.aplicarListado();
  }

  /** Pipeline único: búsqueda de texto + filtros (AND) sobre el listado completo. */
  private aplicarListado(): void {
    this.usuariosFiltrados = filtrarListado(
      this.usuariosTodos,
      this.busqueda,
      usuario => [usuario.nombre],
      [
        this.filtroTipo == null ? null : (usuario: any) =>
          this.coincideTipoUsuario(usuario.tipo, this.filtroTipo!)
      ]
    );
    // La barra de acciones no debe apuntar a una fila que ya no está.
    this.filaSeleccionada = -1;
  }

  /** Reproduce la lógica de `mostrarTipo`: 1 y 2 = Administrador, 3 = Editor, resto = Lector. */
  private coincideTipoUsuario(tipo: number, filtro: string): boolean {
    switch (filtro) {
      case 'admin':
        return tipo === 1 || tipo === 2;
      case 'editor':
        return tipo === 3;
      default:
        return tipo !== 1 && tipo !== 2 && tipo !== 3;
    }
  }

  cambiarFiltroTipo(valor: string | null): void {
    this.filtroTipo = valor;
    this.aplicarListado();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroTipo = null;
    this.aplicarListado();
  }

  get hayFiltrosActivos(): boolean {
    return !!this.busqueda || this.filtroTipo != null;
  }

  mostrarTipo(tipo: number) {
    switch(tipo) {
      case 1:
      case 2:  
        return "Administrador"
      case 3:
        return "Editor"
      default:
        return "Lector"
    }
  }

  claseTipo(tipo: number) {
    switch(tipo) {
      case 1:
      case 2:  
        return "badge bg-success"
      case 3:
        return "badge bg-primary"
      default:
        return "badge bg-secondary"
    }
  }

  esUsuarioActual(usuario: any) {
    return this.usuario.id === usuario.id;
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

  verUsuario(index: number) {
    const usuario = this.usuariosFiltrados[index];
    this.router.navigate([`/empresa/gestionar-usuarios/ver/${usuario.id}`]);
  }

  editarFila() {
    if (this.filaSeleccionada !== -1) {
      const usuario = this.usuariosFiltrados[this.filaSeleccionada];
      this.router.navigate([`/empresa/gestionar-usuarios/editar/${usuario.id}`]);
    }
  }

  usarComoFila() {
    if (this.filaSeleccionada !== -1) {
      const usuario = this.usuariosFiltrados[this.filaSeleccionada];
      if (this.esUsuarioActual(usuario)) return;
      if (confirm(`Al aceptar se cerrará la sesión actual e iniciará sesión como "${usuario.correo}"`)) {
        this.realizarAccion(
          usuario.uid,
          {
            correo: usuario.correo,
            contrasena: this.encriptadorService.desencriptarContrasena(usuario.contrasena)
          }
        ).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Bienvenido(a) a GMA Sistema", undefined);
          this.router.navigate([""]);
        }).catch(_ => {
          this.mensajesService.mostrarMensaje("error", "No se pudo iniciar sesión", undefined);
        });
      }
    }
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      const usuario = this.usuariosFiltrados[this.filaSeleccionada];
      if (this.esUsuarioActual(usuario)) return;
      if (confirm(`¿Desea eliminar a "${usuario.nombre}"?`)) {
        this.usuarioService.borrarUsuario(usuario.id).then(_ => {
          this.usuariosTodos = this.usuariosTodos.filter(us => us.id !== usuario.id);
          this.usuariosFiltrados = this.usuariosFiltrados.filter(us => us.id !== usuario.id);
          this.mensajesService.mostrarMensaje("success", "Usuario borrado con éxito", undefined);
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
  }

  // iniciar sesión o registrar
  realizarAccion(uid: string, datos: any) {
    if (uid !== "") return this.usuarioService.iniciarSesion(datos);
    return this.usuarioService.registrar(datos);
  }
}
