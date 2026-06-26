import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { RiesgosService } from 'src/app/core/services/riesgos.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';

@Component({
  selector: 'app-admin-riesgos-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  busqueda = "";
  empresasTodas: any[] = [];
  empresasFiltradas: any[] = [];
  ths = ["#", "Empresa"];
  filaSeleccionada = -1;

  constructor(
    private titleService: Title,
    private riesgosService: RiesgosService,
    private empresasService: EmpresasService,
    private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Riesgos Ambientales");
    this.empresasService.obtenerEmpresas().subscribe(datos => {
      this.empresasTodas = datos;
      this.empresasFiltradas = this.empresasTodas;
      this.cargando = false;
    });
  }

  buscar(event: any) {
    const busquedaMinuscula = event.toLowerCase();
    this.empresasFiltradas = this.empresasTodas.filter(empresa =>
      empresa.nombre.toLowerCase().includes(busquedaMinuscula));
  }

  seleccionarFila(event: Event, index: number) {
    event.stopPropagation();
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.filaSeleccionada = index;
    } else {
      this.filaSeleccionada = -1;
    }
  }

  verRiesgo(index: number) {
    const empresa = this.empresasFiltradas[index];
    this.router.navigate([`admin/riesgos-ambientales/view/${empresa.id}`]);
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      const empresa = this.empresasFiltradas[this.filaSeleccionada];
      if (confirm(`¿Desea eliminar los riesgos ambientales de "${empresa.nombre}"?`)) {
        this.riesgosService.obtenerRiesgoPorEmpresaId(empresa.id).then(async res => {
          if (res.docs.length > 0) {
            const riesgoDoc = res.docs[0];
            await this.riesgosService.borrarRiesgo(riesgoDoc.id);
            this.mensajesService.mostrarMensaje("success", "Riesgos ambientales eliminados con éxito", undefined);
          } else {
            this.mensajesService.mostrarMensaje("info", "Esta empresa no tiene registros de riesgos ambientales", undefined);
          }
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
  }

  descargarCSV() {
    if (this.filaSeleccionada === -1) return;

    const empresa = this.empresasFiltradas[this.filaSeleccionada];

    this.riesgosService.obtenerRiesgoPorEmpresaId(empresa.id).then(async res => {
      if (res.docs.length === 0) {
        this.mensajesService.mostrarMensaje("info", "Esta empresa no tiene registros de riesgos ambientales", undefined);
        return;
      }

      const riesgoData = res.docs[0].data();
      const nombreEmpresa = empresa.nombre.toLocaleLowerCase().replace(" ", "_");
      const numero = Date.now();
      const nombreArchivo = `${nombreEmpresa}_matriz_riesgos_${numero}`;

      const encabezados = ["Actividad", "Aspecto Ambiental", "Impacto", "Probabilidad", "Severidad", "Riesgo", "Clasificación", "Control", "Acción"];

      const filas = riesgoData['riesgo'].map((r: any) => [
        r.actividad,
        r.aspectoAmbiental,
        r.impacto,
        r.p,
        r.s,
        r.p * r.s,
        this.calcularClasificacion(r.p * r.s),
        r.control,
        r.accion
      ]);

      const contenido = [
        encabezados.join(';'),
        ...filas.map((fila: any) => fila.join(';'))
      ].join('\n');

      const blob = new Blob(
        ['\uFEFF' + contenido],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${nombreArchivo}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  calcularClasificacion(riesgo: number) {
    if (riesgo <= 4) return "Bajo";
    if (riesgo <= 9) return "Medio";
    return "Alto";
  }
}
