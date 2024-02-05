import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaLegalService {

  constructor(private firestore: Firestore) { }

  crearArea( areaLegal:any ) {
    const areaRef = collection(this.firestore, "area-legal");
    return addDoc(areaRef, areaLegal);
  }

  obtenerAreas() {
    const areaRef = collection(this.firestore, "area-legal");
    return collectionData(areaRef, {idField: 'id'}) as Observable<any[]>;
  }
}
