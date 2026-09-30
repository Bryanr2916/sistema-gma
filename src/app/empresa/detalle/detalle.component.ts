import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  cargando = true;
  datosListos = false;
  logoListo = false;
  imagenTarjetaLista = false;
  empresa = {
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    pais: "",
    paises: "",
    urlLogo: "",
    notas: "",
    admin: ""
  };

  constructor(
    private titleService: Title, private empresasService: EmpresasService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresa");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      if (usuario?.['empresaId']) {
        this.empresa.id = usuario['empresaId'];
        this.cargarEmpresa();
      } else {
        this.datosListos = true;
        this.imagenTarjetaLista = true;
        this.verificarListo();
      }
    });
  }

  cargarEmpresa = async () => {
    const respuesta = await this.empresasService.obtenerEmpresa(this.empresa.id);
    this.empresa.nombre = respuesta.get("nombre");
    this.empresa.correo = respuesta.get("correo");
    this.empresa.telefono = respuesta.get("telefono");
    this.empresa.pais = respuesta.get("pais");
    this.empresa.paises = respuesta.get("paises");
    this.empresa.urlLogo = respuesta.get("urlLogo");
    this.empresa.notas = respuesta.get("notas");
    this.empresa.admin = respuesta.get("admin");
    this.datosListos = true;
    this.precargarImagenTarjeta();
    this.verificarListo();
  }

  onLogoListo(): void {
    this.logoListo = true;
    this.verificarListo();
  }

  private precargarImagenTarjeta(): void {
    if (!this.empresa.urlLogo) {
      this.imagenTarjetaLista = true;
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.imagenTarjetaLista = true;
      this.verificarListo();
    };
    img.onerror = () => {
      this.imagenTarjetaLista = true;
      this.verificarListo();
    };
    img.src = this.empresa.urlLogo;
  }

  private verificarListo(): void {
    if (this.datosListos && this.logoListo && this.imagenTarjetaLista) {
      this.cargando = false;
    }
  }

}
