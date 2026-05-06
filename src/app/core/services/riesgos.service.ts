import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RiesgosService {

    path = environment.production ? "riesgos" : "riesgos-dev";

    constructor(private firestore: Firestore) { }

    filaRiesgo() {
        const riesgo = {
            actividad: "",
            aspectoAmbiental: "",
            impacto: "",
            p: 1,
            s: 1,
            control: "",
            accion: ""
        }

        return riesgo;
    }

    rangoClasificaciones() {
        const cl = {
            bajo: 4,
            medio: 9
        };

        return cl;
    }

    crearRiesgo(riesgo: any) {
        const riesgoRef = collection(this.firestore, this.path);
        return addDoc(riesgoRef, { ...riesgo, fechaCreacion: serverTimestamp() });
    }

    obtenerRiesgo(id: any) {
        const riesgoRef = doc(this.firestore, `${this.path}/${id}`);
        return getDoc(riesgoRef);
    }
    
    obtenerRiesgoPorEmpresaId(empresaId: string) {
        const riesgoRef = collection(this.firestore, this.path);

        const riesgoEmpresa = query(riesgoRef, where("empresaId", "==", empresaId));
        return getDocs(riesgoEmpresa);
    }

    editarRiesgo(riesgo: any) {
        const riesgoRef = doc(this.firestore, `${this.path}/${riesgo.id}`);
        return updateDoc(riesgoRef, { ...riesgo, fechaEdicion: serverTimestamp() });
    }
}
