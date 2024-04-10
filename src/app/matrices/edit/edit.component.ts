import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  matriz = {
    empresa: "",
    titulo: "",
    id: ""
  }

  empresas: any[] = [];

  constructor(
    private titleService: Title,
    private empresaService: EmpresasService,
    private matricesService: MatricesService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.route.params.subscribe( params => {
      this.matriz.id = params["id"];
    });
    this.matricesService.obtenerMatriz(this.matriz.id).then(respuesta => {
      this.matriz.titulo = respuesta.get("titulo");
      this.matriz.empresa = respuesta.get("empresa");
    });
    this.empresaService.obtenerEmpresas().subscribe(datos => {
      this.empresas = datos;
    });
  }

  editarMatriz() {
    if(this.formularioEsValido()) {
      this.matricesService.editarMatriz(
        this.matriz
      ).then(data => {
        console.log(data);
        this.toastr.success("Matriz editada con éxito", undefined, {
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
