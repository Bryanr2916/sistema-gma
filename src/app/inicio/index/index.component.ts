import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  menu = [
    {logo:"briefcase", nombre: "Empresas", enlace: "empresas"},
    {logo:"globe", nombre: "Sucursales", enlace: "sucursales"},
    {logo:"table-cells", nombre: "Matrices", enlace: "matrices"},
    {logo:"book", nombre: "Normativas", enlace: "normativas"},
    {logo:"rectangle-list", nombre: "Tipos de Normativas", enlace: "tipos-normativas"},
    {logo:"bookmark", nombre: "Área Legal", enlace: "area-legal"},
    {logo:"user", nombre: "Perfil de Usuario", enlace: "usuario/bryanr2916@gmail.com"}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
