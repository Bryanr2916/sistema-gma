import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { NormativaService } from 'src/app/core/services/normativa.service';

@Component({
  selector: 'app-articulos-aplicables',
  templateUrl: './articulos-aplicables.component.html',
  styleUrls: ['./articulos-aplicables.component.scss']
})
export class ArticulosAplicablesComponent implements OnInit {
  cargando = true;
  matriz = {titulo: "", empresa: ""};
  empresa = {nombre: "", pais: ""};
  areasLegales: any[] = [];
  normativas:any[] = [];
  articulosAplicables = {
    matrizId: "",
    normativaId: "",
    areaLegalId: "",
    numeroArticulos: 0,
    articulos: "",
    tramites: "",
    cumplimiento: "",
    aspectosAmbientales: "",
    cambiosRecientes: "",
  };
  constructor(private areaLegalService:AreaLegalService, private normativaService:NormativaService,
    private matricesService:MatricesService, private route: ActivatedRoute,
    private empresaService:EmpresasService, private titleService: Title,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.cargarInformacion();
  }

  cargarInformacion = async () => {
    this.route.params.subscribe( async params => {
      this.articulosAplicables.matrizId = params["id"];
      const respuesta = await this.matricesService.obtenerMatriz(params["id"]);
      this.matriz.titulo = respuesta.get("titulo");
      this.matriz.empresa = respuesta.get("empresa");
      
      const respuestaEmpresa = await this.empresaService.obtenerEmpresa(this.matriz.empresa);
      this.empresa.nombre = respuestaEmpresa.get("nombre");
      this.empresa.pais = respuestaEmpresa.get("pais");

      this.areaLegalService.obtenerAreas().subscribe(datosArea => {
        this.areasLegales = datosArea;
        this.normativaService.obtenerNormativas().subscribe(datosNormativa => {
          this.normativas = datosNormativa.filter(dn => dn.pais === this.empresa.pais);
          this.cargando = false;
        });
      });
    });
  };

  formularioEsValido() {
    return true;
  }

  crearArticulo() {
    this.matricesService.agregarArticulosAplicables(this.articulosAplicables).then(_ => {
      this.toastr.success("Artículos aplicables creados con éxito", undefined, {
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
