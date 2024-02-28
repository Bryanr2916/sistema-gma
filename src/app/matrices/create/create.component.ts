import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  matriz = {
    empresa: "",
    titulo: ""
  }

  empresas: any[] = [];

  constructor(
    private titleService: Title,
    private empresaService: EmpresasService,
    private matricesService: MatricesService,
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.empresaService.obtenerEmpresas().subscribe(datos => {
      this.empresas = datos;
    });
  }

  crearMatriz() {
    if (this.formularioEsValido()) {
      this.matricesService.crearMatriz(this.matriz).then(_ => {
        this.toastr.success("Matriz creada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["/matrices"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  formularioEsValido() {

    if (this.matriz.titulo === "") {
      return false;
    }

    if (this.matriz.empresa === "" || this.matriz.empresa === "vacio") {
      return false;
    }
    return true;
  }

}
