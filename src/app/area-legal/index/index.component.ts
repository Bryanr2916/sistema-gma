import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  acciones= ["Editar |", "Borrar"]
  ths = ["#","Nombre", "Acciones"];
  trs = [
    { nombre: "loremadfad adfasdf asdfasd"},
    { nombre: "ljaldfjal aldsjlasdjfajds flajfaldskjf"},
    { nombre: "este es "},
    { nombre: "adfadsfasf"},
    { nombre: "zczva"},
    { nombre: "Normas adsfa"},
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
  }

}
