import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc } from '@angular/fire/firestore';
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
    const areasRef = collection(this.firestore, this.path);
    return collectionData(areasRef, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerArea(id: any) {
    const areaRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(areaRef);
  }

  editarArea(area: any) {
    const areaRef = doc(this.firestore, `${this.path}/${area.id}`);
    return updateDoc(areaRef, area);
  }

  borrarArea(id: any) {
    const areaRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(areaRef);
  }
}
