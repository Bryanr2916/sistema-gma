/**
 * Utilidades de filtrado para los listados (componentes index).
 *
 * Patrón común: la búsqueda de texto y los filtros por dropdown se combinan
 * siempre en modo AND dentro de un único pipeline `filtrarListado()`.
 */

/** Normaliza un valor a minúsculas para comparaciones de búsqueda. */
export function normalizarTexto(valor: any): string {
  return (valor ?? '').toString().trim().toLowerCase();
}

/**
 * Indica si alguno de los valores contiene el término de búsqueda.
 * Si el término está vacío, siempre es `true` (no filtra).
 */
export function coincideConBusqueda(valores: any[], termino: string): boolean {
  const terminoNormalizado = normalizarTexto(termino);
  if (!terminoNormalizado) {
    return true;
  }
  return (valores || []).some(valor =>
    normalizarTexto(valor).includes(terminoNormalizado)
  );
}

/**
 * Pipeline único de un listado: búsqueda de texto + condiciones de filtro (AND).
 *
 * - `terminoBusqueda`: texto ingresado en el input de búsqueda.
 * - `camposBusqueda`: extrae los campos del item sobre los que se busca.
 * - `condiciones`: un predicado por cada filtro; los `null`/`undefined`
 *   (filtros inactivos) se ignoran.
 *
 * Ejemplo:
 * ```ts
 * this.empresasFiltradas = filtrarListado(
 *   this.empresasTodas,
 *   this.busqueda,
 *   e => [e.nombre],
 *   [this.filtroAdmin === null ? null : (e: any) => this.tieneAdmin(e) === this.filtroAdmin]
 * );
 * ```
 */
export function filtrarListado<T>(
  datos: T[],
  terminoBusqueda: string,
  camposBusqueda: (item: T) => any[],
  condiciones: Array<((item: T) => boolean) | null | undefined> = []
): T[] {
  const activas = condiciones.filter(
    (condicion): condicion is (item: T) => boolean => typeof condicion === 'function'
  );
  return (datos || []).filter(item =>
    coincideConBusqueda(camposBusqueda(item), terminoBusqueda) &&
    activas.every(condicion => condicion(item))
  );
}
