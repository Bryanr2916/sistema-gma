import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, runTransaction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private firestore: Firestore) { }

  crearEmpresa(empresa: any, admin: any) {
    console.log(empresa, admin);
  }
}
