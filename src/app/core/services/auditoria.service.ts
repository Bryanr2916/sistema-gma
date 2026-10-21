import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';

export type TipoAccionAuditoria = 'crear' | 'modificar' | 'eliminar';

export interface CambioAuditoria {
  campo: string;
  antes: any;
  despues: any;
}

export interface EventoAuditoria {
  coleccion: string;
  accion: TipoAccionAuditoria;
  documentoId: string;
  empresaId?: string | null;
  cambios?: CambioAuditoria[];
  datosPrevios?: any;
}

const CAMPOS_EXCLUIDOS = ['id', 'fechaCreacion', 'fechaEdicion'];

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  path = environment.useProductionData ? "auditoria" : "auditoria-dev";

  constructor(private firestore: Firestore, private auth: Auth, private usuarioService: UsuarioService) { }

  /** Usuario que disparó la operación (auth + datos de Firestore), con fallback seguro. */
  private async usuarioActual(): Promise<any> {
    try {
      const usuario = await firstValueFrom(this.usuarioService.usuarioActual());
      if (usuario) {
        const { uid, correo, nombre, tipo, empresaId } = usuario;
        return { uid: uid ?? null, correo: correo ?? null, nombre: nombre ?? null, tipo: tipo ?? null, empresaId: empresaId ?? null };
      }
    } catch (e) {
      console.warn('AuditoriaService: no se pudo obtener el usuario de Firestore', e);
    }

    const authUser = await firstValueFrom(user(this.auth));
    return {
      uid: authUser?.uid ?? 'desconocido',
      correo: authUser?.email ?? null,
      nombre: null,
      tipo: null,
      empresaId: null
    };
  }

  /** Compara campo a campo, ignorando ids y timestamps. */
  calcularCambios(antes: any, despues: any): CambioAuditoria[] {
    const cambios: CambioAuditoria[] = [];
    const claves = new Set([...Object.keys(antes ?? {}), ...Object.keys(despues ?? {})]);

    claves.forEach((campo) => {
      if (CAMPOS_EXCLUIDOS.includes(campo)) return;

      const valorAntes = antes?.[campo];
      const valorDespues = despues?.[campo];
      if (JSON.stringify(valorAntes ?? null) !== JSON.stringify(valorDespues ?? null)) {
        cambios.push({ campo, antes: valorAntes ?? null, despues: valorDespues ?? null });
      }
    });

    return cambios;
  }

  /**
   * Registra un evento de auditoría. Nunca lanza: si falla el log,
   * la operación principal continúa normalmente.
   */
  async registrar(evento: EventoAuditoria): Promise<void> {
    try {
      const usuario = await this.usuarioActual();
      const auditoriaRef = collection(this.firestore, this.path);

      await addDoc(auditoriaRef, {
        coleccion: evento.coleccion,
        accion: evento.accion,
        documentoId: evento.documentoId,
        usuario,
        empresaId: evento.empresaId ?? usuario.empresaId ?? null,
        cambios: evento.cambios ?? [],
        datosPrevios: evento.datosPrevios ?? null,
        fecha: serverTimestamp()
      });
    } catch (e) {
      console.warn('AuditoriaService: no se pudo registrar el evento', evento, e);
    }
  }
}
