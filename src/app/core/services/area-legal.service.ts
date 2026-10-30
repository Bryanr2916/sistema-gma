import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, serverTimestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { rutaDatos } from 'src/app/core/entorno-datos';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})
export class AreaLegalService {

  path = rutaDatos("area-legal");
  constructor(private firestore: Firestore, private auditoria: AuditoriaService) { }

  async crearArea( areaLegal:any ) {
    const areaRef = collection(this.firestore, this.path);
    const referencia = await addDoc(areaRef, {...areaLegal, fechaCreacion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'crear',
      documentoId: referencia.id,
      empresaId: areaLegal.empresaId ?? null,
      cambios: this.auditoria.calcularCambios({}, areaLegal)
    });

    return referencia;
  }

  obtenerAreas() {
    const areasRef = collection(this.firestore, this.path);

    //todo: ordenamiento de los demas services y script para actualizar todos los datos
    const q = query(areasRef, orderBy('fechaCreacion', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerArea(id: any) {
    const areaRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(areaRef);
  }

  async editarArea(area: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, area.id);
    const areaRef = doc(this.firestore, `${this.path}/${area.id}`);
    await updateDoc(areaRef, {...area, fechaEdicion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'modificar',
      documentoId: area.id,
      empresaId: area.empresaId ?? null,
      cambios: this.auditoria.calcularCambios(previa, area)
    });
  }

  async borrarArea(id: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, id);
    const areaRef = doc(this.firestore, `${this.path}/${id}`);
    await deleteDoc(areaRef);

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'eliminar',
      documentoId: id,
      empresaId: previa?.empresaId ?? null,
      datosPrevios: previa ?? null
    });
  }
}
