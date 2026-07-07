import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

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
  ths = ["#","Título","Artículos"];
  usuario: any = { };
  filaSeleccionada = -1;
  esLector = false;

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
      this.cargarUsuario();
    });
  }

  async cargarUsuario() {
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.esLector = this.usuario.tipo === TIPOS_USUARIO.lector;
      this.cargarMatrices();
    });
  }

  async cargarMatrices() {
    this.matricesService.obtenerMatrices().subscribe(async datos => {
      this.matricesTodas = datos.filter(matriz => matriz.empresa === this.usuario.empresaId);
      this.matricesFiltradas = this.matricesTodas;
      this.articulosAplicables = (await this.matricesService.obtenerArticulosAplicables()).docs.map((value) => { return {id: value.id, ...value.data() };});
      this.cargando = false;
    });
  }

  nombreEmpresa (id: string) {
    return this.empresas.find(emp => emp.id === id).nombre
  }

  obtenerCantidadArticulosAplicables(matrizId: string) {
    return this.articulosAplicables.filter(aa => {
      return aa.matrizId === matrizId;
    }).length;
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.matricesFiltradas = this.matricesTodas.filter(matriz => 
      matriz.titulo.toLowerCase().includes(busquedaMinuscuala));
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
    this.router.navigate([`matrices/ver/${matriz.id}`]);
  }

  editarFila() {
    if (this.filaSeleccionada !== -1) {
      const matriz = this.matricesFiltradas[this.filaSeleccionada];
      this.router.navigate([`matrices/editar/${matriz.id}`]);
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
      this.router.navigate([`matrices/crear-articulos/${matriz.id}`]);
    }
  }

}
