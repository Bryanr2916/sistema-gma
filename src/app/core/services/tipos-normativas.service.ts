import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
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
}
