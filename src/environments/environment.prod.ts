export const environment = {
  production: true,
  useProductionData: true,
  // Secreto que, guardado en localStorage bajo la clave 'GMA_ENTORNO', fuerza el uso
  // de datos de pruebas (-dev) desde producción. Ver src/app/core/entorno-datos.ts
  claveEntornoPruebas: "gma-entorno-pruebas-2026",
  secrectKey: "gm@-2024",
  firebase: {
    apiKey: "AIzaSyDatiFzqXXmK2Y_P__yrrIl6skgKkAOLgg",
    authDomain: "gma-sistema-e71c2.firebaseapp.com",
    databaseURL: "https://gma-sistema-e71c2-default-rtdb.firebaseio.com",
    projectId: "gma-sistema-e71c2",
    storageBucket: "gma-sistema-e71c2.appspot.com",
    messagingSenderId: "71201059232",
    appId: "1:71201059232:web:406afa7c90609387ef34c5",
    measurementId: "G-PBGNS23TDZ"
  }
};
