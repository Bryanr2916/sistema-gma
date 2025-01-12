import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatricesService {

  path = "matrices";
  articulosPath = "articulos";
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

  obtenerArticuloMatriz(id: any) {
    const articuloRef = doc(this.firestore, `${this.articulosPath}/${id}`);
    return getDoc(articuloRef);
  }

  editarArticulo(articulo: any) {
    const articuloRef = doc(this.firestore, `${this.articulosPath}/${articulo.id}`);
    return updateDoc(articuloRef, articulo);
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
    const articulosAplicablesRef = collection(this.firestore, this.articulosPath);

    return addDoc(articulosAplicablesRef, articulosAplicables);
  }

  obtenerArticulosAplicables(matrizId?: string) {
    const articuloRef = collection(this.firestore, this.articulosPath);
    
    if (matrizId) {
      const articulosMatriz = query(articuloRef, where("matrizId", "==", matrizId));
      return getDocs(articulosMatriz);
    } else {
      const articulosMatriz = query(articuloRef);
      return getDocs(articulosMatriz);
    }
  }
}
