import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  private pathUsuarios = environment.useProductionData ? "usuarios" : "usuarios-dev";

  constructor(private firestore: Firestore, private auth: Auth) { }

  /** Usuario que disparó la operación (auth + datos de Firestore), con fallback seguro. */
  private async usuarioActual(): Promise<any> {
    const authUser = await firstValueFrom(user(this.auth));

    if (!authUser) {
      return { uid: 'desconocido', correo: null, nombre: null, tipo: null, empresaId: null };
    }

    try {
      const usuariosRef = collection(this.firestore, this.pathUsuarios);
      const snap = await getDocs(query(usuariosRef, where('uid', '==', authUser.uid)));
      const dbUser = snap.docs[0]?.data();

      return {
        uid: authUser.uid,
        correo: dbUser?.['correo'] ?? authUser.email ?? null,
        nombre: dbUser?.['nombre'] ?? null,
        tipo: dbUser?.['tipo'] ?? null,
        empresaId: dbUser?.['empresaId'] ?? null
      };
    } catch (e) {
      console.warn('AuditoriaService: no se pudo obtener el usuario de Firestore', e);
      return {
        uid: authUser.uid,
        correo: authUser.email ?? null,
        nombre: null,
        tipo: null,
        empresaId: null
      };
    }
  }

  /** Estado previo de un documento (para diff y snapshots de eliminación). */
  async documentoPrevio(path: string, id: any): Promise<any | null> {
    try {
      const snapshot = await getDoc(doc(this.firestore, `${path}/${id}`));
      return snapshot.exists() ? snapshot.data() : null;
    } catch (e) {
      console.warn('AuditoriaService: no se pudo leer el documento previo', e);
      return null;
    }
  }

  /** Compara campo a campo, ignorando ids, timestamps y campos sensibles. */
  calcularCambios(antes: any, despues: any, camposExcluidos: string[] = []): CambioAuditoria[] {
    const excluidos = [...CAMPOS_EXCLUIDOS, ...camposExcluidos];
    const cambios: CambioAuditoria[] = [];
    const claves = new Set([...Object.keys(antes ?? {}), ...Object.keys(despues ?? {})]);

    claves.forEach((campo) => {
      if (excluidos.includes(campo)) return;

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
