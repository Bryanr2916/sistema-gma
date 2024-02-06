import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private titleService: Title, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Inicio");
  }

}
