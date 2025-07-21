import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-articulos-aplicables',
  templateUrl: './articulos-aplicables.component.html',
  styleUrls: ['./articulos-aplicables.component.scss']
})
export class ArticulosAplicablesComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  cargando = true;
  matriz = {titulo: "", empresa: ""};
  empresa = {nombre: "", paises: [] as any []};
  areasLegales: any[] = [];
  normativas:any[] = [];
  articulosAplicables = {
    matrizId: "",
    normativaId: "",
    areaLegalId: "",
    numeroArticulos: "",
    articulos: "",
    tramites: "",
    cumplimiento: "",
    aspectosAmbientales: "",
    cambiosRecientes: "",
  };

  constructor(private areaLegalService:AreaLegalService, private normativaService:NormativaService,
    private matricesService:MatricesService, private route: ActivatedRoute,
    private empresaService:EmpresasService, private titleService: Title,
    private mensajesService: MensajesService, private router: Router, public fb: FormBuilder) {
      this.definirFormulario();
    }

  definirFormulario() {
    this.formulario = this.fb.group({
      normativaId: ["", [Validators.required, seleccionVacia()]],
      areaLegalId: ["", [Validators.required, seleccionVacia()]],
      numeroArticulos: ["", [Validators.required]],
      articulos: ["", []],
      tramites: ["", []],
      cumplimiento: ["", []],
      aspectosAmbientales: ["", []],
      cambiosRecientes: ["", []]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.cargarInformacion();
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  cargarInformacion = async () => {
    this.route.params.subscribe( async params => {
      this.articulosAplicables.matrizId = params["id"];
      const respuesta = await this.matricesService.obtenerMatriz(params["id"]);
      this.matriz.titulo = respuesta.get("titulo");
      this.matriz.empresa = respuesta.get("empresa");
      
      const respuestaEmpresa = await this.empresaService.obtenerEmpresa(this.matriz.empresa);
      this.empresa.nombre = respuestaEmpresa.get("nombre");
      this.empresa.paises = respuestaEmpresa.get("paises");

      this.areaLegalService.obtenerAreas().subscribe(datosArea => {
        this.areasLegales = datosArea;
        this.normativaService.obtenerNormativas().subscribe(datosNormativa => {
          this.normativas = datosNormativa.filter(dn => this.empresa.paises.includes(dn.pais));
          this.cargando = false;
        });
      });
    });
  };

  crearArticulo() {

    this.formulario.markAllAsTouched();

    if (this.formulario.valid) {

      this.articulosAplicables.normativaId = this.formulario.controls["normativaId"].value;
      this.articulosAplicables.areaLegalId = this.formulario.controls["areaLegalId"].value;
      this.articulosAplicables.numeroArticulos = this.formulario.controls["numeroArticulos"].value;
      this.articulosAplicables.articulos = this.formulario.controls["articulos"].value;
      this.articulosAplicables.tramites = this.formulario.controls["tramites"].value;
      this.articulosAplicables.cumplimiento = this.formulario.controls["cumplimiento"].value;
      this.articulosAplicables.aspectosAmbientales = this.formulario.controls["aspectosAmbientales"].value;
      this.articulosAplicables.cambiosRecientes = this.formulario.controls["cambiosRecientes"].value;

      this.matricesService.agregarArticulosAplicables(this.articulosAplicables).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Artículos aplicables creados con éxito", undefined);
        this.router.navigate(["/matrices"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }

}
