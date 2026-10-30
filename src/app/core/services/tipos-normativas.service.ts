import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, query, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { rutaDatos } from 'src/app/core/entorno-datos';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})
export class TiposNormativasService {

  path = rutaDatos("tipos-normativas");
  constructor(private firestore: Firestore, private auditoria: AuditoriaService) { }

  async crearTipo( tipoNormativas:any ) {
    const tipoRef = collection(this.firestore, this.path);
    const referencia = await addDoc(tipoRef, {...tipoNormativas, fechaCreacion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'crear',
      documentoId: referencia.id,
      empresaId: tipoNormativas.empresaId ?? null,
      cambios: this.auditoria.calcularCambios({}, tipoNormativas)
    });

    return referencia;
  }

  obtenerTipos() {
    const tipoRef = collection(this.firestore, this.path);
    const q = query(tipoRef, orderBy('fechaCreacion', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerTipo(id: any) {
    const tipoRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(tipoRef);
  }

  async editarTipo(area: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, area.id);
    const tipoRef = doc(this.firestore, `${this.path}/${area.id}`);
    await updateDoc(tipoRef, {...area, fechaEdicion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'modificar',
      documentoId: area.id,
      empresaId: area.empresaId ?? previa?.empresaId ?? null,
      cambios: this.auditoria.calcularCambios(previa, area)
    });
  }

  async borrarTipo(id: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, id);
    const tipoRef = doc(this.firestore, `${this.path}/${id}`);
    await deleteDoc(tipoRef);

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'eliminar',
      documentoId: id,
      empresaId: previa?.empresaId ?? null,
      datosPrevios: previa ?? null
    });
  }
}
