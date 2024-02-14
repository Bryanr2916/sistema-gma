import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PaisesService } from 'src/app/core/services/paises.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  paises = this.paisesService.paises;

  constructor(private titleService: Title, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
  }

}
