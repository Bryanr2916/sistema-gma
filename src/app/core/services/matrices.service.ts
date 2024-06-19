import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatricesService {

  path = "matrices";
  constructor(private firestore: Firestore) { }

  crearMatriz( matriz:any ) {
    const matrizRef = collection(this.firestore, this.path);
    return addDoc(matrizRef, matriz);
  }

  obtenerMatrices() {
    const matrizRef = collection(this.firestore, this.path);
    return collectionData(matrizRef, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerMatriz(id: any) {
    const matrizRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(matrizRef);
  }

  editarMatriz(matriz: any) {
    const matrizRef = doc(this.firestore, `${this.path}/${matriz.id}`);
    return updateDoc(matrizRef, matriz);
  }

  borrarMatriz(id: any) {
    const matrizRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(matrizRef);
  }

  agregarArticulosAplicables(articulosAplicables: any) {
    const matrizDocRef = doc(this.firestore, `${this.path}/${articulosAplicables.matrizId}`);
    const articulosAplicablesRef = collection(matrizDocRef, 'articulosAplicables') as CollectionReference;

    return addDoc(articulosAplicablesRef, articulosAplicables);
  }
}
