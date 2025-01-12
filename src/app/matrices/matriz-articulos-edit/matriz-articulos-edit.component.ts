import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { NormativaService } from 'src/app/core/services/normativa.service';

@Component({
  selector: 'app-matriz-articulos-edit',
  templateUrl: './matriz-articulos-edit.component.html',
  styleUrls: ['./matriz-articulos-edit.component.scss']
})
export class MatrizArticulosEditComponent implements OnInit {
  matriz = {id: "", titulo: "", empresa: ""};
  empresa = {nombre: "", pais: ""};
  areasLegales: any[] = [];
  normativas:any[] = [];
  articulo = {
    id: "",
    tramites: "",
    numeroArticulos: "",
    normativaId: "",
    matrizId: "",
    cumplimiento: "",
    cambiosRecientes: "",
    aspectosAmbientales: "",
    articulos: "",
    areaLegalId: ""
  };

  cargando = true;

  constructor(
    private titleService: Title,
    private areaLegalService:AreaLegalService,
    private normativaService:NormativaService,
    private matricesService: MatricesService,
    private empresaService: EmpresasService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.cargarInformacion();
  }

  formularioEsValido = () => {
    return true;
  };

  editar = () => {
    this.matricesService.editarArticulo(this.articulo).then(_ => {
      this.toastr.success("Artículo editado con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(["/matrices"]);
    });
  };

  cargarInformacion = async () => {
    this.route.params.subscribe(async params => {
      // articulo
      this.articulo.id = params["id"];
      const rArticulo = (await this.matricesService.obtenerArticuloMatriz(this.articulo.id)).data();
      this.articulo = {...this.articulo, ...rArticulo};
      // matriz
      this.matriz.id = this.articulo.matrizId;
      const rMatriz = (await this.matricesService.obtenerMatriz(this.matriz.id)).data();
      this.matriz = {...this.matriz, ...rMatriz};
      // empresa
      const rEmpresa = (await this.empresaService.obtenerEmpresa(this.matriz.empresa)).data();
      this.empresa = {...this.empresa, ...rEmpresa};
      //areas legales
      this.areaLegalService.obtenerAreas().subscribe(datosArea => {
        this.areasLegales = datosArea;
        this.normativaService.obtenerNormativas().subscribe(datosNormativa => {
          this.normativas = datosNormativa.filter(dn => dn.id === this.articulo.normativaId || dn.id === this.articulo.normativaId );
          this.cargando = false;
        });
      });
    });
  };

}
