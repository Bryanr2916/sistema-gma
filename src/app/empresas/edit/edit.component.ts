import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  displayLogo = "";
  archivoLogo:any = null;
  archivoNuevo:any = null;
 
  paises = this.paisesService.paises;
  
  empresa = {
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    pais: "",
    urlLogo: "",
    notas: ""
  };

  admin = {
    uid: "",
    nombre: "",
    correo: "",
    contrasena: "",
    repContrasena: "",
    empresaId: "",
    //administrador de empresa
    tipo: 2
  }

  constructor(
    private titleService: Title, private empresasService: EmpresasService,
    private paisesService: PaisesService, private usuarioService:UsuarioService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe( params => {
      this.empresa.id = params["id"];
    });

    this.obtenerEmpresa();
  }

  obtenerEmpresa = async () => {
    const respuesta = await this.empresasService.obtenerEmpresa(this.empresa.id);
    const datosEmpresa = respuesta.data();
    console.log(datosEmpresa);
    if (datosEmpresa) {
      this.empresa.correo = datosEmpresa['correo'];
      this.empresa.nombre = datosEmpresa['nombre']; 
      this.empresa.telefono = datosEmpresa['telefono'];
      this.empresa.pais = datosEmpresa['pais'];
      this.empresa.urlLogo = datosEmpresa['urlLogo'];
      this.empresa.notas = datosEmpresa['notas'];

      this.displayLogo = datosEmpresa['urlLogo'];
      this.archivoLogo = datosEmpresa['urlLogo']
    }
  }

  editarEmpresa() {
    if (this.formularioEsValido()) {
      if (this.archivoNuevo) {
        this.empresasService.subirArchivo(this.archivoNuevo).then(respuesta => {
        this.empresa.urlLogo = respuesta;
        this.editarEmpresaFB();
        })
      } else {
        this.editarEmpresaFB();
      }
    }
  }

  editarEmpresaFB() {
    this.empresasService.editarEmpresa(this.empresa).then(rEmpresa => {
      console.log(rEmpresa);
    });
  }

  formularioEsValido() {
    return true;
  }

  mostrarImagen($event:any) {
    if ($event.target.files) {
      this.archivoLogo = $event.target.files[0];
      this.archivoNuevo = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoLogo);
      reader.onload = (e:any) => {
        this.displayLogo = e.target.result;
      }
    }
  }
}
