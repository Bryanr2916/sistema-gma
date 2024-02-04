import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  areaLegal = { nombre:"" };

  constructor(private titleService: Title, private areaService: AreaLegalService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
  }

  crearArea() {
    if(this.formularioEsValido()) {
      this.areaService.crearArea(
        this.areaLegal
      ).then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  formularioEsValido() {
    return this.areaLegal.nombre !== "";
  }

}
