import { environment } from 'src/environments/environment';

/**
 * Clave de localStorage que habilita el modo de datos de pruebas.
 *
 * Activar:    localStorage.setItem('GMA_ENTORNO', '<environment.claveEntornoPruebas>')
 * Desactivar: localStorage.removeItem('GMA_ENTORNO')
 *
 * Después de cambiarla hay que recargar la página para que aplique en todas las pantallas.
 */
export const CLAVE_ENTORNO_PRUEBAS = 'GMA_ENTORNO';

/**
 * Indica si se deben usar los datos de pruebas (colecciones/carpetas con sufijo `-dev`).
 * Solo es true si el valor almacenado en localStorage coincide con el secreto
 * definido en `environment.claveEntornoPruebas`.
 */
export function esModoPruebas(): boolean {
  try {
    return localStorage.getItem(CLAVE_ENTORNO_PRUEBAS) === environment.claveEntornoPruebas;
  } catch (e) {
    // localStorage no disponible (p. ej. modo privado estricto): modo normal.
    return false;
  }
}

/**
 * Resuelve la ruta de una colección de Firestore o de una carpeta de Storage
 * según el entorno de datos activo.
 *
 * Ejemplos:
 *   rutaDatos('usuarios')                          // 'usuarios' | 'usuarios-dev'
 *   rutaDatos('empresas/logos', 'empresas/logos-dev')
 */
export function rutaDatos(prod: string, dev?: string): string {
  const usarProduccion = environment.useProductionData && !esModoPruebas();

  if (usarProduccion) {
    return prod;
  }

  return dev ?? `${prod}-dev`;
}
