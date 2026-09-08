import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { RiesgosService } from 'src/app/core/services/riesgos.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';

type ElementoPaginacion =
  | { tipo: 'pagina'; num: number }
  | { tipo: 'ellipsis' };

@Component({
  selector: 'app-admin-riesgos-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  private readonly TAMANO_PAGINA = 20;

  cargandoInicial = true;
  cargandoListado = false;
  busqueda = "";
  ths = ["#", "Empresa"];
  empresasFiltradas: any[] = [];
  filaSeleccionada = -1;

  paginaActual = 1;
  totalRegistros = 0;
  totalPaginas = 0;

  private ultimoDocPorPagina = new Map<number, QueryDocumentSnapshot>();
  private itemsPorPagina = new Map<number, any[]>();
  private empresasTodasCache: any[] | null = null;
  resultadosBusqueda: any[] = [];

  private debounceTimer: any;

  constructor(
    private titleService: Title,
    private riesgosService: RiesgosService,
    private empresasService: EmpresasService,
    private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Riesgos Ambientales");
    this.inicializarListado();
  }

  private async inicializarListado(): Promise<void> {
    this.cargandoInicial = true;
    this.ultimoDocPorPagina.clear();
    this.itemsPorPagina.clear();

    const [total, primeraPagina] = await Promise.all([
      this.empresasService.contarEmpresas(),
      this.empresasService.obtenerEmpresasPagina(this.TAMANO_PAGINA, null),
    ]);

    this.totalRegistros = total;
    this.totalPaginas = Math.ceil(total / this.TAMANO_PAGINA);
    this.aplicarPagina(1, primeraPagina.items, primeraPagina.ultimoDoc);
    this.cargandoInicial = false;
  }

  private aplicarPagina(n: number, items: any[], ultimoDoc: QueryDocumentSnapshot | null): void {
    this.itemsPorPagina.set(n, items);
    if (ultimoDoc) {
      this.ultimoDocPorPagina.set(n, ultimoDoc);
    }
    this.empresasFiltradas = items;
    this.paginaActual = n;
  }

  private paginaAnclaMasCercana(destino: number): { cursor: QueryDocumentSnapshot | null; pagina: number } {
    for (let i = destino - 1; i >= 1; i--) {
      const cursor = this.ultimoDocPorPagina.get(i);
      if (cursor) {
        return { cursor, pagina: i };
      }
    }
    return { cursor: null, pagina: 0 };
  }

  private async guardarRangoPaginas(paginas: Map<number, { items: any[]; ultimoDoc: QueryDocumentSnapshot | null }>): Promise<void> {
    paginas.forEach((valor, clave) => {
      this.itemsPorPagina.set(clave, valor.items);
      if (valor.ultimoDoc) {
        this.ultimoDocPorPagina.set(clave, valor.ultimoDoc);
      }
    });
  }

  async irAPagina(n: number): Promise<void> {
    if (n < 1 || n > this.totalPaginas || n === this.paginaActual) return;

    if (this.enModoBusqueda) {
      this.aplicarPaginaBusqueda(n);
      return;
    }

    const cacheada = this.itemsPorPagina.get(n);
    if (cacheada) {
      this.empresasFiltradas = cacheada;
      this.paginaActual = n;
      return;
    }

    this.cargandoListado = true;

    if (n === this.totalPaginas) {
      const resultado = await this.empresasService.obtenerUltimaPagina(
        this.TAMANO_PAGINA, this.totalRegistros, this.totalPaginas
      );
      this.aplicarPagina(n, resultado.items, resultado.ultimoDoc);
    } else if (n === 1) {
      const resultado = await this.empresasService.obtenerEmpresasPagina(this.TAMANO_PAGINA, null);
      this.aplicarPagina(1, resultado.items, resultado.ultimoDoc);
    } else if (n === this.paginaActual + 1) {
      const cursor = this.ultimoDocPorPagina.get(this.paginaActual) ?? null;
      const resultado = await this.empresasService.obtenerEmpresasPagina(this.TAMANO_PAGINA, cursor);
      this.aplicarPagina(n, resultado.items, resultado.ultimoDoc);
    } else {
      const ancla = this.paginaAnclaMasCercana(n);
      const rango = await this.empresasService.obtenerRangoPaginas(
        ancla.cursor, ancla.pagina, n, this.TAMANO_PAGINA
      );
      await this.guardarRangoPaginas(rango);
      const datos = this.itemsPorPagina.get(n);
      if (datos) {
        this.empresasFiltradas = datos;
        this.paginaActual = n;
      }
    }

    this.cargandoListado = false;
  }

  paginaAnterior(): void {
    this.irAPagina(this.paginaActual - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual + 1);
  }

  get elementosPaginacion(): ElementoPaginacion[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    if (total <= 9) {
      return Array.from({ length: total }, (_, i) => ({ tipo: 'pagina' as const, num: i + 1 }));
    }
    const elementos: ElementoPaginacion[] = [];
    elementos.push({ tipo: 'pagina', num: 1 });
    if (actual > 4) {
      elementos.push({ tipo: 'ellipsis' });
    }
    const inicio = Math.max(2, actual - 2);
    const fin = Math.min(total - 1, actual + 2);
    for (let i = inicio; i <= fin; i++) {
      elementos.push({ tipo: 'pagina', num: i });
    }
    if (actual < total - 3) {
      elementos.push({ tipo: 'ellipsis' });
    }
    elementos.push({ tipo: 'pagina', num: total });
    return elementos;
  }

  get enModoBusqueda(): boolean {
    return this.busqueda.trim().length > 0;
  }

  private aplicarPaginaBusqueda(n: number): void {
    const TAMANO = this.TAMANO_PAGINA;
    const inicio = (n - 1) * TAMANO;
    this.empresasFiltradas = this.resultadosBusqueda.slice(inicio, inicio + TAMANO);
    this.paginaActual = n;
  }

  private salirModoBusqueda(): void {
    this.empresasTodasCache = null;
    this.resultadosBusqueda = [];
    this.inicializarListado();
  }

  async buscar(event: any): Promise<void> {
    clearTimeout(this.debounceTimer);

    const termino = (event ?? '').toString().trim().toLowerCase();

    if (termino.length === 0) {
      this.salirModoBusqueda();
      return;
    }

    this.debounceTimer = setTimeout(async () => {
      if (!this.empresasTodasCache) {
        this.empresasTodasCache = await this.empresasService.obtenerTodasEmpresasListado();
      }
      this.resultadosBusqueda = this.empresasTodasCache.filter(e =>
        e.nombre?.toLowerCase().includes(termino)
      );
      this.totalPaginas = Math.max(1, Math.ceil(this.resultadosBusqueda.length / this.TAMANO_PAGINA));
      this.paginaActual = 1;
      this.aplicarPaginaBusqueda(1);
    }, 300);
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

  private async recargarTrasBorrado(): Promise<void> {
    this.itemsPorPagina.clear();
    this.ultimoDocPorPagina.clear();
    this.empresasTodasCache = null;

    const total = await this.empresasService.contarEmpresas();
    this.totalRegistros = total;
    this.totalPaginas = Math.max(1, Math.ceil(total / this.TAMANO_PAGINA));

    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    }

    if (this.enModoBusqueda) {
      this.empresasTodasCache = await this.empresasService.obtenerTodasEmpresasListado();
      const termino = this.busqueda.trim().toLowerCase();
      this.resultadosBusqueda = this.empresasTodasCache.filter(e =>
        e.nombre?.toLowerCase().includes(termino)
      );
      this.totalPaginas = Math.max(1, Math.ceil(this.resultadosBusqueda.length / this.TAMANO_PAGINA));
      this.aplicarPaginaBusqueda(this.paginaActual);
    } else {
      this.cargandoListado = true;
      const resultado = await this.empresasService.obtenerEmpresasPagina(this.TAMANO_PAGINA, null);
      this.aplicarPagina(1, resultado.items, resultado.ultimoDoc);
      this.cargandoListado = false;
    }
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
        }).finally(async () => {
          this.filaSeleccionada = -1;
          await this.recargarTrasBorrado();
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
