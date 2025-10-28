import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { EncriptadorService } from 'src/app/core/services/encriptador.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  busqueda = "";
  ths = ["#","Empresa", "Administrador", "Correo Electrónico", "Acciones"];
  empresasTodas:any[] = [];
  empresasFiltradas:any[] = [];
  usuarios:any[] = [];

  constructor(
    private titleService: Title, private empresaService: EmpresasService,
    private mensajesService: MensajesService, private usuarioService: UsuarioService,
    private router: Router, private encriptador: EncriptadorService, private empresasService:EmpresasService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.empresaService.obtenerEmpresas().subscribe(datos => {
      this.empresasTodas = datos;
      this.empresasFiltradas = this.empresasTodas;
      this.cargarUsuarios()
    });
  }

  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(datos => {
      this.cargando = false;
      this.usuarios = datos;
    });
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.empresasFiltradas = this.empresasTodas.filter(empresa => 
      empresa.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

  async borrarImagenActual(urlLogo: string) {
    if (urlLogo !== "") {
      await this.empresasService.borrarArchivo(urlLogo);
    }
  }

  borrarEmpresaFB(empresa: any) {
    this.empresaService.borrarEmpresa(empresa.id).then(_ => {
      this.mensajesService.mostrarMensaje("success", "Empresa borrada con éxito", undefined);
      });
  }

  borrar(empresa: any) {
    if (confirm(`¿Desea eliminar la empresa "${empresa.nombre}"?`)) {

      if (empresa.urlLogo) {
        this.borrarImagenActual(empresa.urlLogo).then(_ => {
          this.borrarEmpresaFB(empresa);
        });
      } else {
        this.borrarEmpresaFB(empresa);
      }
    }
  }

  duplicar (empresa: any) {
    if (confirm(`¿Desea duplicar la empresa "${empresa.nombre}"?`)) {
      const empDuplicada = {...empresa, nombre: `copia de ${empresa.nombre}`, urlLogo: ""};
      this.empresasService.crearEmpresa(empDuplicada).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Empresa creada con éxito", undefined);
      });
    }
  }

  usuarioAdmin(empresa: any) {
    return this.usuarios.find( usuario => usuario.empresaId === empresa.id && usuario.tipo === TIPOS_USUARIO.admin)?.correo;
  }

}
