import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import type { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';
import { TruncarTextoPipe } from 'src/app/share/pipes/truncar-texto.pipe';

type ElementoPaginacion =
  | { tipo: 'pagina'; num: number }
  | { tipo: 'ellipsis' };

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [TruncarTextoPipe]
})
export class IndexComponent implements OnInit {

  readonly TAMANO_PAGINA = 20;

  cargandoInicial = true;
  cargandoListado = false;
  busqueda = "";
  tipos: any[] = [];
  ths = ["#", "Título", "Número", "Archivo", "Tipo de Normativa"];
  filaSeleccionada = -1;

  paginaActual = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  normativasFiltradas: any[] = [];

  /** Último documento de cada página ya resuelta (clave = número de página, base 1). */
  private ultimoDocPorPagina = new Map<number, QueryDocumentSnapshot>();

  /** Items cacheados por página para evitar consultas al revisitar. */
  private itemsPorPagina = new Map<number, any[]>();

  /** Dataset completo cacheado para búsqueda global. */
  private normativasTodasCache: any[] | null = null;

  /** Resultados filtrados del término de búsqueda actual. */
  private resultadosBusqueda: any[] = [];

  private debounceBusqueda?: ReturnType<typeof setTimeout>;

  get enModoBusqueda(): boolean {
    return this.busqueda.trim().length > 0;
  }

  constructor(private titleService: Title, private mensajesService: MensajesService,
    private normativaService: NormativaService, private tiposService: TiposNormativasService,
    private truncarTexto: TruncarTextoPipe, private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.tiposService.obtenerTipos().subscribe({
      next: (datos) => {
        this.tipos = datos;
        void this.inicializarListado(true);
      },
      error: (err) => {
        console.error(err);
        this.cargandoInicial = false;
      }
    });
  }

  private async inicializarListado(esCargaInicial = false): Promise<void> {
    if (esCargaInicial) {
      this.cargandoInicial = true;
    } else {
      this.cargandoListado = true;
    }
    try {
      const [total, primera] = await Promise.all([
        this.normativaService.contarNormativas(),
        this.normativaService.obtenerNormativasPagina(this.TAMANO_PAGINA, null),
      ]);
      this.totalRegistros = total;
      this.totalPaginas = total === 0 ? 0 : Math.ceil(total / this.TAMANO_PAGINA);
      this.ultimoDocPorPagina.clear();
      this.itemsPorPagina.clear();
      this.paginaActual = 1;
      this.aplicarPagina(1, primera.items, primera.ultimoDoc);
    } catch (e) {
      console.error(e);
      this.totalRegistros = 0;
      this.totalPaginas = 0;
      this.normativasFiltradas = [];
    } finally {
      if (esCargaInicial) {
        this.cargandoInicial = false;
      } else {
        this.cargandoListado = false;
      }
    }
  }

  private aplicarPagina(
    n: number,
    items: any[],
    ultimoDoc: QueryDocumentSnapshot | null
  ): void {
    this.normativasFiltradas = items;
    this.paginaActual = n;
    this.itemsPorPagina.set(n, items);
    if (ultimoDoc) {
      this.ultimoDocPorPagina.set(n, ultimoDoc);
    } else {
      this.ultimoDocPorPagina.delete(n);
    }
  }

  private paginaAnclaMasCercana(destino: number): {
    pagina: number;
    cursor: QueryDocumentSnapshot | null;
  } {
    for (let p = destino - 1; p >= 1; p--) {
      const cursor = this.ultimoDocPorPagina.get(p);
      if (cursor) {
        return { pagina: p, cursor };
      }
    }
    return { pagina: 0, cursor: null };
  }

  private guardarRangoPaginas(
    paginas: Map<number, { items: any[]; ultimoDoc: QueryDocumentSnapshot | null }>
  ): void {
    paginas.forEach((data, pagina) => {
      this.itemsPorPagina.set(pagina, data.items);
      if (data.ultimoDoc) {
        this.ultimoDocPorPagina.set(pagina, data.ultimoDoc);
      } else {
        this.ultimoDocPorPagina.delete(pagina);
      }
    });
  }

  async irAPagina(n: number, forzar = false): Promise<void> {
    if (this.totalPaginas === 0) {
      return;
    }
    if (n < 1 || n > this.totalPaginas) {
      return;
    }
    if (!forzar && n === this.paginaActual) {
      return;
    }

    if (this.enModoBusqueda) {
      this.aplicarPaginaBusqueda(n);
      return;
    }

    if (!forzar && this.itemsPorPagina.has(n)) {
      this.normativasFiltradas = this.itemsPorPagina.get(n)!;
      this.paginaActual = n;
      return;
    }

    this.cargandoListado = true;
    try {
      if (n === this.totalPaginas && this.totalPaginas > 1) {
        const ultima = await this.normativaService.obtenerUltimaPagina(
          this.TAMANO_PAGINA,
          this.totalRegistros,
          this.totalPaginas
        );
        this.aplicarPagina(n, ultima.items, ultima.ultimoDoc);
        return;
      }

      if (n === 1) {
        const primera = await this.normativaService.obtenerNormativasPagina(
          this.TAMANO_PAGINA,
          null
        );
        this.aplicarPagina(n, primera.items, primera.ultimoDoc);
        return;
      }

      if (
        !forzar &&
        n === this.paginaActual + 1 &&
        this.ultimoDocPorPagina.has(n - 1)
      ) {
        const { items, ultimoDoc } = await this.normativaService.obtenerNormativasPagina(
          this.TAMANO_PAGINA,
          this.ultimoDocPorPagina.get(n - 1)!
        );
        this.aplicarPagina(n, items, ultimoDoc);
        return;
      }

      const { pagina: paginaAncla, cursor: cursorAncla } =
        this.paginaAnclaMasCercana(n);
      const paginas = await this.normativaService.obtenerRangoPaginas(
        cursorAncla,
        paginaAncla,
        n,
        this.TAMANO_PAGINA
      );
      this.guardarRangoPaginas(paginas);

      const destino = paginas.get(n);
      if (destino) {
        this.normativasFiltradas = destino.items;
        this.paginaActual = n;
      }
    } finally {
      this.cargandoListado = false;
    }
  }

  paginaAnterior(): void {
    void this.irAPagina(this.paginaActual - 1);
  }

  paginaSiguiente(): void {
    void this.irAPagina(this.paginaActual + 1);
  }

  get elementosPaginacion(): ElementoPaginacion[] {
    const total = this.totalPaginas;
    const cur = this.paginaActual;
    const out: ElementoPaginacion[] = [];
    if (total <= 0) {
      return out;
    }
    if (total <= 9) {
      for (let i = 1; i <= total; i++) {
        out.push({ tipo: 'pagina', num: i });
      }
      return out;
    }
    const pushPagina = (n: number) => out.push({ tipo: 'pagina', num: n });
    const pushEllipsis = () => {
      const last = out[out.length - 1];
      if (last?.tipo === 'ellipsis') {
        return;
      }
      out.push({ tipo: 'ellipsis' });
    };

    pushPagina(1);
    const start = Math.max(2, cur - 2);
    const end = Math.min(total - 1, cur + 2);
    if (start > 2) {
      pushEllipsis();
    }
    for (let i = start; i <= end; i++) {
      pushPagina(i);
    }
    if (end < total - 1) {
      pushEllipsis();
    }
    pushPagina(total);
    return out;
  }

  buscar(_valor: string): void {
    clearTimeout(this.debounceBusqueda);
    this.debounceBusqueda = setTimeout(() => void this.ejecutarBusqueda(), 300);
  }

  private aplicarPaginaBusqueda(n: number): void {
    this.paginaActual = n;
    const inicio = (n - 1) * this.TAMANO_PAGINA;
    this.normativasFiltradas = this.resultadosBusqueda.slice(
      inicio,
      inicio + this.TAMANO_PAGINA
    );
  }

  private filtrarNormativas(normativas: any[], termino: string): any[] {
    return normativas.filter(
      (n) =>
        String(n.numero ?? '').toLowerCase().includes(termino) ||
        String(n.titulo ?? '').toLowerCase().includes(termino)
    );
  }

  private async ejecutarBusqueda(): Promise<void> {
    const term = this.busqueda.trim().toLowerCase();
    if (!term) {
      await this.salirModoBusqueda();
      return;
    }

    const necesitaFetch = this.normativasTodasCache === null;
    if (necesitaFetch) {
      this.cargandoListado = true;
    }
    try {
      if (necesitaFetch) {
        this.normativasTodasCache =
          await this.normativaService.obtenerTodasNormativasListado();
      }
      this.resultadosBusqueda = this.filtrarNormativas(
        this.normativasTodasCache!,
        term
      );
      this.totalRegistros = this.resultadosBusqueda.length;
      this.totalPaginas =
        this.totalRegistros === 0
          ? 0
          : Math.ceil(this.totalRegistros / this.TAMANO_PAGINA);
      if (this.totalPaginas > 0) {
        this.aplicarPaginaBusqueda(1);
      } else {
        this.paginaActual = 1;
        this.normativasFiltradas = [];
      }
    } catch (e) {
      console.error(e);
      this.resultadosBusqueda = [];
      this.totalRegistros = 0;
      this.totalPaginas = 0;
      this.normativasFiltradas = [];
    } finally {
      if (necesitaFetch) {
        this.cargandoListado = false;
      }
    }
  }

  private async salirModoBusqueda(): Promise<void> {
    this.normativasTodasCache = null;
    this.resultadosBusqueda = [];
    await this.inicializarListado(false);
  }

  borrarNormativaFB(normativa: any): void {
    this.normativaService.borrarNormativa(normativa.id).then(async () => {
      this.mensajesService.mostrarMensaje("success", "Normativa borrada con éxito", undefined);
      await this.recargarTrasBorrado();
    });
  }

  private async recargarTrasBorrado(): Promise<void> {
    this.normativasTodasCache = null;
    if (this.enModoBusqueda) {
      const paginaPrevia = this.paginaActual;
      await this.ejecutarBusqueda();
      if (this.totalPaginas > 0) {
        const pagina = Math.min(paginaPrevia, this.totalPaginas);
        this.aplicarPaginaBusqueda(pagina);
      }
      return;
    }

    this.cargandoListado = true;
    try {
      this.totalRegistros = await this.normativaService.contarNormativas();
      this.totalPaginas =
        this.totalRegistros === 0 ? 0 : Math.ceil(this.totalRegistros / this.TAMANO_PAGINA);
      if (this.totalPaginas === 0) {
        this.paginaActual = 1;
        this.normativasFiltradas = [];
        this.ultimoDocPorPagina.clear();
        this.itemsPorPagina.clear();
      } else {
        if (this.paginaActual > this.totalPaginas) {
          this.paginaActual = this.totalPaginas;
        }
        this.ultimoDocPorPagina.clear();
        this.itemsPorPagina.clear();
        await this.irAPagina(this.paginaActual, true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.cargandoListado = false;
    }
  }

  borrar(normativa: any): void {

    if (confirm(`¿Desea eliminar la normativa "${this.truncarTexto.transform(normativa.titulo, 68, true)}"?`)) {
      this.borrarNormativaFB(normativa);
    }
  }

  nombreTipo(id: any): string {
    const tipo = this.tipos.find(t => t.id === id);

    if (tipo) {
      return tipo.nombre;
    }
    return "Desconocido";
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

  verNormativa(index: number) {
    const normativa = this.normativasFiltradas[index];
    this.router.navigate([`/normativas/ver/${normativa.id}`]);
  }

  editarFila() {
    if (this.filaSeleccionada !== -1) {
      const normativa = this.normativasFiltradas[this.filaSeleccionada];
      this.router.navigate([`/normativas/editar/${normativa.id}`]);
    }
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      const normativa = this.normativasFiltradas[this.filaSeleccionada];
      this.borrar(normativa);
      this.filaSeleccionada = -1;
    }
  }

}
