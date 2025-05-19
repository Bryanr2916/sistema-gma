import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-usuarios-index',
  templateUrl: './usuarios-index.component.html',
  styleUrls: ['./usuarios-index.component.scss']
})
export class UsuariosIndexComponent implements OnInit {

  cargando = true;
  busqueda = "";
  ths = ["#","Nombre", "Correo", "Tipo", "Acciones"];
  usuariosTodos:any[] = [];
  usuariosFiltrados:any[] = [];
  empresa = {
    id: "",
    nombre: ""
  };

  constructor(private titleService: Title, private usuarioService: UsuarioService,
    private empresasService:EmpresasService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe( params => {
      this.empresa.id = params["id"];
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
      this.usuariosTodos = reUsuarios.docs.map(usDoc => usDoc.data());
      console.log("usuariosTodos: ", this.usuariosTodos);
      this.usuariosFiltrados = this.usuariosTodos;
      this.cargando = false;
    }
  };

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
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

  usarComo(usuario: any) {}
  borrar(usuario: any) {
    if (confirm(`¿Desea eliminar a "${usuario.nombre}"?`)) {
      console.log("eliminando");
    }
  }
}
