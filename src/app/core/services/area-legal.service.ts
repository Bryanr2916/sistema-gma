import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, serverTimestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaLegalService {

  path = "area-legal";
  constructor(private firestore: Firestore) { }

  crearArea( areaLegal:any ) {
    const areaRef = collection(this.firestore, this.path);
    return addDoc(areaRef, {...areaLegal, fechaCreacion: serverTimestamp()});
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

  editarArea(area: any) {
    const areaRef = doc(this.firestore, `${this.path}/${area.id}`);
    return updateDoc(areaRef, {...area, fechaEdicion: serverTimestamp()});
  }

  borrarArea(id: any) {
    const areaRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(areaRef);
  }
}
