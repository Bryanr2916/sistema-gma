import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-matriz-articulos-view',
  templateUrl: './matriz-articulos-view.component.html',
  styleUrls: ['./matriz-articulos-view.component.scss']
})
export class MatrizArticulosViewComponent implements OnInit {

  @Input() articulo: any;
  @Input() normativa: any;
  tabs = [
    {value: "general", label: "General"},
    {value: "articulos", label: "Artículos"},
    {value: "cumplimiento", label: "Cumplimiento"},
    {value: "aspectosAmbientales", label: "Riesgos"},
    {value: "cambiosRecientes", label: "Cambios Recientes"}
  ];
  tab = {value: "general", label: "General"};

  constructor() { }

  ngOnInit(): void {
  }

  changeTab(activeTab: any) {
    this.tab = activeTab;
  }

}
