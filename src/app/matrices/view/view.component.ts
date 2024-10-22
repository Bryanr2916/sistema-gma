import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { NormativaService } from 'src/app/core/services/normativa.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  cargando = true;
  matriz = {id: "", titulo: "" };
  areaSeleccionada = {id: ""};
  articulosAplicablesTodos: any[] = [];
  articulosAplicablesFiltro: any[] = [];
  areasLegales:any[] = [];
  areasAplicables:any[] = [];
  normativas:any[] = [];

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private matricesService: MatricesService,
    private areaLegalService: AreaLegalService,
    private normativaService:NormativaService
  ) { }

    ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.route.params.subscribe( params => {
      this.matriz.id = params["id"];
    });

    this.getMatrizData();
  }

  async getMatrizData () {
    try {
      const matrizFB = await this.matricesService.obtenerMatriz(this.matriz.id);
      this.matriz.titulo = matrizFB.get("titulo");

      const articulosFB = await this.matricesService.obtenerArticulosAplicables(this.matriz.id);
      this.articulosAplicablesTodos = articulosFB.docs.map((value) => { return {id: value.id, ...value.data() };});

      this.areaLegalService.obtenerAreas().subscribe(areasFB => {
        this.areasLegales = areasFB;
        this.areasAplicables = this.areasLegales.filter(area => {
          const busqueda = this.articulosAplicablesTodos.findIndex(aa => {
            return aa.areaLegalId === area.id;
          });
          return busqueda !== -1;
        });
      });

      this.normativaService.obtenerNormativas().subscribe(normativasFB => {
        this.normativas = normativasFB;
        this.cargando = false;
      });
    } catch(error) {
      console.log(error);
    }
  }

  seleccionarAreaLegal() {
    this.articulosAplicablesFiltro = this.articulosAplicablesTodos.filter(articulo => articulo.areaLegalId === this.areaSeleccionada.id);
  }

  obtenerNormativa(id: string) {
    return this.normativas.find(normativa => normativa.id === id);
  }

  obtenerCantidadArticulos(areaId: string) {
    return this.articulosAplicablesTodos.filter(aa => aa.areaLegalId === areaId).length;
  }

}
