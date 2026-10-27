import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})
export class MatricesService {
  path = environment.useProductionData ? "matrices" : "matrices-dev";
  articulosPath = environment.useProductionData ? "articulos" : "articulos-dev";
  constructor(private firestore: Firestore, private auditoria: AuditoriaService) { }

  // matriz

  async crearMatriz( matriz:any ) {
    const matrizRef = collection(this.firestore, this.path);
    const referencia = await addDoc(matrizRef, {...matriz, fechaCreacion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'crear',
      documentoId: referencia.id,
      empresaId: matriz.empresa ?? null,
      cambios: this.auditoria.calcularCambios({}, matriz)
    });

    return referencia;
  }

  obtenerMatrices() {
    const matrizRef = collection(this.firestore, this.path);
    const q = query(matrizRef, orderBy('fechaCreacion', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerMatriz(id: any) {
    const matrizRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(matrizRef);
  }

  async editarMatriz(matriz: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, matriz.id);
    const matrizRef = doc(this.firestore, `${this.path}/${matriz.id}`);
    await updateDoc(matrizRef, {...matriz, fechaEdicion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'modificar',
      documentoId: matriz.id,
      empresaId: matriz.empresa ?? previa?.empresa ?? null,
      cambios: this.auditoria.calcularCambios(previa, matriz)
    });
  }

  async borrarMatriz(id: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, id);
    const matrizRef = doc(this.firestore, `${this.path}/${id}`);
    await deleteDoc(matrizRef);

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'eliminar',
      documentoId: id,
      empresaId: previa?.empresa ?? null,
      datosPrevios: previa ?? null
    });
  }

  // articulos

  obtenerArticuloMatriz(id: any) {
    const articuloRef = doc(this.firestore, `${this.articulosPath}/${id}`);
    return getDoc(articuloRef);
  }

  async editarArticulo(articulo: any) {
    const previa = await this.auditoria.documentoPrevio(this.articulosPath, articulo.id);
    const articuloRef = doc(this.firestore, `${this.articulosPath}/${articulo.id}`);
    await updateDoc(articuloRef, {...articulo, fechaEdicion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.articulosPath,
      accion: 'modificar',
      documentoId: articulo.id,
      empresaId: articulo.empresaId ?? previa?.empresaId ?? null,
      cambios: this.auditoria.calcularCambios(previa, articulo)
    });
  }

  async agregarArticulosAplicables(articulosAplicables: any) {
    const articulosAplicablesRef = collection(this.firestore, this.articulosPath);
    const referencia = await addDoc(articulosAplicablesRef, {...articulosAplicables, fechaCreacion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.articulosPath,
      accion: 'crear',
      documentoId: referencia.id,
      empresaId: articulosAplicables.empresaId ?? null,
      cambios: this.auditoria.calcularCambios({}, articulosAplicables)
    });

    return referencia;
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

  async borrarArticulo(id: any) {
    const previa = await this.auditoria.documentoPrevio(this.articulosPath, id);
    const articuloRef = doc(this.firestore, `${this.articulosPath}/${id}`);
    await deleteDoc(articuloRef);

    await this.auditoria.registrar({
      coleccion: this.articulosPath,
      accion: 'eliminar',
      documentoId: id,
      empresaId: previa?.empresaId ?? null,
      datosPrevios: previa ?? null
    });
  }
}
