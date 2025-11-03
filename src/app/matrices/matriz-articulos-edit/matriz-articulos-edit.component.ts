import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { ESTADOS_ARTICULO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-matriz-articulos-edit',
  templateUrl: './matriz-articulos-edit.component.html',
  styleUrls: ['./matriz-articulos-edit.component.scss']
})
export class MatrizArticulosEditComponent implements OnInit {

  estados = ESTADOS_ARTICULO;
  formulario: FormGroup = this.fb.group({});

  matriz = {id: "", titulo: "", empresa: ""};
  empresa = {nombre: "", pais: ""};
  areasLegales: any[] = [];
  normativas:any[] = [];
  articulo: any = {
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
    private mensajesService: MensajesService,
    private router: Router,
    private route: ActivatedRoute, public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  definirFormulario() {
    this.formulario = this.fb.group({
      normativaId: ["", [Validators.required, seleccionVacia()]],
      areaLegalId: ["", [Validators.required, seleccionVacia()]],
      estado: ["", [Validators.required, seleccionVacia()]],
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

  editar = () => {

    this.formulario.markAllAsTouched();

    if (this.formulario.valid) {

      this.articulo.areaLegalId = this.formulario.controls["areaLegalId"].value;
      this.articulo.normativaId = this.formulario.controls["normativaId"].value;
      this.articulo.numeroArticulos = this.formulario.controls["numeroArticulos"].value;
      this.articulo.articulos = this.formulario.controls["articulos"].value;
      this.articulo.tramites = this.formulario.controls["tramites"].value;
      this.articulo.cumplimiento = this.formulario.controls["cumplimiento"].value;
      this.articulo.aspectosAmbientales = this.formulario.controls["aspectosAmbientales"].value;
      this.articulo.cambiosRecientes = this.formulario.controls["cambiosRecientes"].value;
      this.articulo.estado = Number.parseInt(this.formulario.controls["estado"].value);

      this.matricesService.editarArticulo(this.articulo).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Artículo editado con éxito", undefined);
        this.router.navigate(["/matrices"]);
      });
    }
  };

  cargarInformacion = async () => {
    this.route.params.subscribe(async params => {
      // articulo
      this.articulo.id = params["id"];
      const rArticulo = (await this.matricesService.obtenerArticuloMatriz(this.articulo.id)).data();
      this.articulo = {...this.articulo, ...rArticulo};

      this.formulario.controls["articulos"].setValue(this.articulo.articulos);
      this.formulario.controls["areaLegalId"].setValue(this.articulo.areaLegalId);
      this.formulario.controls["aspectosAmbientales"].setValue(this.articulo.aspectosAmbientales);
      this.formulario.controls["cambiosRecientes"].setValue(this.articulo.cambiosRecientes);
      this.formulario.controls["cumplimiento"].setValue(this.articulo.cumplimiento);
      this.formulario.controls["normativaId"].setValue(this.articulo.normativaId);
      this.formulario.controls["numeroArticulos"].setValue(this.articulo.numeroArticulos);
      this.formulario.controls["tramites"].setValue(this.articulo.tramites);
      this.formulario.controls["estado"].setValue(this.articulo.estado);

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
