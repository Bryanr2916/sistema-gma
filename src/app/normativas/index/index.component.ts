import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';
import { TruncarTextoPipe } from 'src/app/share/pipes/truncar-texto.pipe';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [TruncarTextoPipe]
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
    private normativaService:NormativaService, private tiposService: TiposNormativasService,
    private truncarTexto: TruncarTextoPipe
  ) { }

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

  async borrarArchivoActual(urlArchivo: string) {
    if (urlArchivo !== "") {
      await this.normativaService.borrarArchivo(urlArchivo);
    }
  }

  borrarNormativaFB(normativa: any) {
    this.normativaService.borrarNormativa(normativa.id).then(_ => {
        this.toastr.success("Normativa borrada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
  }

  borrar(normativa: any) {
    
    if (confirm(`¿Desea eliminar la normativa "${this.truncarTexto.transform(normativa.titulo, 68, true)}"?`)) {

      if (normativa.urlArchivo) {
        this.borrarArchivoActual(normativa.urlArchivo).then(_ => {
          this.borrarNormativaFB(normativa);
        });
      } else {
        this.borrarNormativaFB(normativa);
      };
    }
  }

  nombreTipo(id: any) {
    const tipo = this.tipos.find(tipo => tipo.id === id);

    if (tipo) {
      return tipo.nombre;  
    }
    return "Desconocido";
  }

}
