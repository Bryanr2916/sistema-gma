import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposNormativasService {

  path = "tipos-normativas";
  constructor(private firestore: Firestore) { }

  crearTipo( tipoNormativas:any ) {
    const tipoRef = collection(this.firestore, this.path);
    return addDoc(tipoRef, tipoNormativas);
  }

  obtenerTipos() {
    const tipoRef = collection(this.firestore, this.path);
    return collectionData(tipoRef, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerTipo(id: any) {
    const tipoRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(tipoRef);
  }

  editarTipo(area: any) {
    const areaRef = doc(this.firestore, `${this.path}/${area.id}`);
    return updateDoc(areaRef, area);
  }

  borrarTipo(id: any) {
    const tipoRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(tipoRef);
  }
}
