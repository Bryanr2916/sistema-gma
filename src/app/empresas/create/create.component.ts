import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { PaisesService } from 'src/app/core/services/paises.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  tabEmpresa = true;
 
  paises = this.paisesService.paises;
  
  empresa = {
    nombre: "nombre",
    correo: "correo",
    telefono: "86641188",
    pais: "",
    urlLogo: "https://plus.unsplash.com/premium_photo-1673716788931-894d9e9f3a38?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notas: "esto es una nota!"
  };

  admin = {
    nombre: "Thom Yorke",
    correo: "ty@gmail.com",
    contrasena: "radiohead1sgreat",
    repContrasena: "radiohead1sgreat"
  }

  constructor(private titleService: Title, private empresasService: EmpresasService, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
  }

  crearEmpresa() {
    if (this.formularioEsValido()) {
      this.empresasService.crearEmpresa(this.empresa, this.admin);
    }
  }

  formularioEsValido() {
    return true;
  }

  cambiarTabEmpresa( valor: boolean) {
    this.tabEmpresa = valor;
  }

  mostrarImagen($event:any) {
    if ($event.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onload = (e:any) => {
        this.empresa.urlLogo = e.target.result;
      }
    }
  }

}
