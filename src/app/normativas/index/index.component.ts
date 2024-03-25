import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  cargando = true;
  busqueda = "";
  tipos: any[] = [];
  acciones= ["Editar |", "Borrar"]
  ths = ["Número","Título", "Archivo","Tipo de Normativa", "Acciones"];
  normativasTodas:any[] = [];
  normativasFiltradas:any[] = [];

  constructor(private titleService: Title, private toastr: ToastrService,
    private normativaService:NormativaService, private tiposService: TiposNormativasService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.tiposService.obtenerTipos().subscribe(datos => {
      this.tipos = datos;
      this.normativaService.obtenerNormativas().subscribe(datos => {
        this.normativasTodas = datos;
        this.normativasFiltradas = this.normativasTodas;
        this.cargando = false;
      });
    });
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.normativasFiltradas = this.normativasTodas.filter(normativa => 
      normativa.titulo.toLowerCase().includes(busquedaMinuscuala) ||
      String(normativa.numero).includes(busquedaMinuscuala));
  }

  borrar(normativa: any) {
    if (confirm(`¿Desea eliminar la normativa "${normativa.titulo}"?`)) {
      this.normativaService.borrarNormativa(normativa.id).then(_ => {
        this.toastr.success("Normativa borrada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
    }
  }

  nombreTipo(id: any) {
    return this.tipos.find(tipo => tipo.id === id).nombre;
  }

}
