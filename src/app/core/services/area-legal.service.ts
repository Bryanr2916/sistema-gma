import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AreaLegalService {

  constructor(private firestore: Firestore) { }

  crearArea( areaLegal:any ) {
    const areaRef = collection(this.firestore, "area-legal");
    return addDoc(areaRef, areaLegal);
  }
}
