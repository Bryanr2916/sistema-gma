import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PaisesService } from 'src/app/core/services/paises.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  tipos:any[] = [];
  paises = this.paisesService.paises;

  constructor(private titleService: Title, private paisesService: PaisesService, private tiposService:TiposNormativasService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.tiposService.obtenerTipos().subscribe(datos => {
      this.tipos = datos;
    });
  }

}
