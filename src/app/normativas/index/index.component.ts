import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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

  cargando = true;
  busqueda = "";
  tipos: any[] = [];
  acciones = ["Editar |", "Borrar"];
  ths = ["Número", "Título", "Archivo", "Tipo de Normativa", "Acciones"];

  paginaActual = 1;
  totalRegistros = 0;
  totalPaginas = 0;
  normativasFiltradas: any[] = [];

  /** Último documento de cada página ya resuelta (clave = número de página, base 1). */
  private ultimoDocPorPagina = new Map<number, QueryDocumentSnapshot>();

  constructor(private titleService: Title, private mensajesService: MensajesService,
    private normativaService: NormativaService, private tiposService: TiposNormativasService,
    private truncarTexto: TruncarTextoPipe
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.tiposService.obtenerTipos().subscribe({
      next: (datos) => {
        this.tipos = datos;
        void this.inicializarListado();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  private async inicializarListado(): Promise<void> {
    this.cargando = true;
    try {
      const [total, primera] = await Promise.all([
        this.normativaService.contarNormativas(),
        this.normativaService.obtenerNormativasPagina(this.TAMANO_PAGINA, null),
      ]);
      this.totalRegistros = total;
      this.totalPaginas = total === 0 ? 0 : Math.ceil(total / this.TAMANO_PAGINA);
      this.ultimoDocPorPagina.clear();
      this.paginaActual = 1;
      if (primera.items.length > 0 && primera.ultimoDoc) {
        this.ultimoDocPorPagina.set(1, primera.ultimoDoc);
      }
      this.normativasFiltradas = primera.items;
    } catch (e) {
      console.error(e);
      this.totalRegistros = 0;
      this.totalPaginas = 0;
      this.normativasFiltradas = [];
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Garantiza que exista `ultimoDocPorPagina` para las páginas 1 … paginaDestino - 1
   * (lecturas intermedias sin actualizar la vista).
   */
  private async asegurarCursorsHastaPagina(paginaDestino: number): Promise<void> {
    for (let p = 1; p < paginaDestino; p++) {
      if (!this.ultimoDocPorPagina.has(p)) {
        const cursorAnt = p === 1 ? null : this.ultimoDocPorPagina.get(p - 1)!;
        const { items, ultimoDoc } = await this.normativaService.obtenerNormativasPagina(
          this.TAMANO_PAGINA,
          cursorAnt
        );
        if (items.length === 0 || !ultimoDoc) {
          break;
        }
        this.ultimoDocPorPagina.set(p, ultimoDoc);
      }
    }
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

    this.cargando = true;
    try {
      await this.asegurarCursorsHastaPagina(n);
      const cursorAnt =
        n === 1 ? null : this.ultimoDocPorPagina.get(n - 1) ?? null;
      if (n > 1 && cursorAnt == null) {
        return;
      }
      const { items, ultimoDoc } = await this.normativaService.obtenerNormativasPagina(
        this.TAMANO_PAGINA,
        cursorAnt
      );
      this.normativasFiltradas = items;
      this.paginaActual = n;
      if (ultimoDoc) {
        this.ultimoDocPorPagina.set(n, ultimoDoc);
      } else {
        this.ultimoDocPorPagina.delete(n);
      }
    } finally {
      this.cargando = false;
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

  buscar(_event: any): void {
    // La búsqueda global quedará para una iteración futura con consultas en servidor.
  }

  borrarNormativaFB(normativa: any): void {
    this.normativaService.borrarNormativa(normativa.id).then(async () => {
      this.mensajesService.mostrarMensaje("success", "Normativa borrada con éxito", undefined);
      await this.recargarTrasBorrado();
    });
  }

  private async recargarTrasBorrado(): Promise<void> {
    this.cargando = true;
    try {
      this.totalRegistros = await this.normativaService.contarNormativas();
      this.totalPaginas =
        this.totalRegistros === 0 ? 0 : Math.ceil(this.totalRegistros / this.TAMANO_PAGINA);
      if (this.totalPaginas === 0) {
        this.paginaActual = 1;
        this.normativasFiltradas = [];
        this.ultimoDocPorPagina.clear();
      } else {
        if (this.paginaActual > this.totalPaginas) {
          this.paginaActual = this.totalPaginas;
        }
        this.ultimoDocPorPagina.clear();
        await this.irAPagina(this.paginaActual, true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.cargando = false;
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

}
