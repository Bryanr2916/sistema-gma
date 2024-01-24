import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
