import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  tabEmpresa = true;
  displayLogo = "";
  archivoLogo:any = null;
 
  paises = this.paisesService.paises;
  
  empresa = {
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
    private paisesService: PaisesService, private usuarioService:UsuarioService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
  }

  editarEmpresa() {
    console.log("editando...");
  }

  formularioEsValido() {
    return true;
  }

  cambiarTabEmpresa( valor: boolean) {
    this.tabEmpresa = valor;
  }

  mostrarImagen($event:any) {
    if ($event.target.files) {
      this.archivoLogo = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoLogo);
      reader.onload = (e:any) => {
        this.displayLogo = e.target.result;
      }
    }
  }
}
