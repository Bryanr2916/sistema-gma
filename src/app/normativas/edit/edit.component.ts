import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  archivo:any = null;
  normativa = {
    id: "",
    titulo: "",
    tipoId: "",
    numero: "",
    fecha: "",
    pais: "",
    modificacion: "",
    entidad: "",
    enlace: "",
    comentarios: "",
    urlArchivo: ""
  }
  tipos:any[] = [];
  paises = this.paisesService.paises;

  constructor(
    private titleService: Title,
    private normativaService: NormativaService,
    private tiposService: TiposNormativasService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.route.params.subscribe( params => {
      this.normativa.id = params["id"];
    });

    this.normativaService.obtenerNormativa(this.normativa.id).then( respuesta => {
      this.normativa.titulo = respuesta.get("titulo");
      this.normativa.tipoId = respuesta.get("tipoId");
      this.normativa.numero = respuesta.get("numero");
      this.normativa.fecha = respuesta.get("fecha");
      this.normativa.pais = respuesta.get("pais");
      this.normativa.modificacion = respuesta.get("modificacion");
      this.normativa.entidad = respuesta.get("entidad");
      this.normativa.enlace = respuesta.get("enlace");
      this.normativa.comentarios = respuesta.get("comentarios");
      this.normativa.urlArchivo = respuesta.get("urlArchivo");
      this.tiposService.obtenerTipos().subscribe(datos => {
        this.tipos = datos;
      });
    });
  }
  
  editarNormativa() {
    if (this.formularioEsValido()) {

      if (this.archivo) {
        this.normativaService.subirArchivo(this.archivo).then( respuesta => {
          this.normativa.urlArchivo = respuesta;
          this.editarNormativaFB();
        });
      } else {
        this.editarNormativaFB();
      }
    }
  }

  editarNormativaFB() {
    this.normativaService.editarNormativa(this.normativa).then(_ => {
      this.toastr.success("Normativa editada con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(["/normativas"]);        
    }).catch(error => {
      console.log(error);
    });
  }

  formularioEsValido() {
    return true;
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }
}
