import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaLegalService {

  path = "area-legal";
  constructor(private firestore: Firestore) { }

  crearArea( areaLegal:any ) {
    const areaRef = collection(this.firestore, this.path);
    return addDoc(areaRef, areaLegal);
  }

  obtenerAreas() {
    const areaRef = collection(this.firestore, this.path);
    return collectionData(areaRef, {idField: 'id'}) as Observable<any[]>;
  }

  borrarArea(id: any) {
    const areaRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(areaRef);
  }
}
