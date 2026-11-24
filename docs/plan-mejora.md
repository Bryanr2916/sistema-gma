Plan de Mejoras del Sistema (sin testing)

Objetivo

Reducir riesgos críticos, mejorar rendimiento percibido y mantenibilidad del código, y preparar una evolución arquitectónica gradual sin romper operación actual.

Estado actual observado





Frontend monolítico Angular 13 con acceso directo a Firebase desde cliente.



Backend en Cloud Functions muy delgado (principalmente triggers).



Duplicación funcional entre módulos empresa y empresas.



Carga de datos y renderizado con patrones que generan sobrecoste en Firestore y UI.



Riesgos críticos de seguridad en reglas y manejo de credenciales.

Arquitectura objetivo (fases)

flowchart LR
  user[Usuario] --> ui[AngularUI]
  ui --> appServices[AppServices]
  appServices --> dataLayer[DataAccessLayer]
  dataLayer --> firestore[FirestoreStorage]
  appServices --> secureFns[SecureCloudFunctions]
  secureFns --> auth[FirebaseAuth]
  secureFns --> firestore

Priorización general





Crítico inmediato (Semana 1): seguridad y lógica sensible.



Alto impacto (Semanas 2-3): rendimiento en consultas/render y deuda estructural principal.



Mediano plazo (Semanas 4-6): desacople arquitectónico y estandarización de capas.

Fase 1: Riesgos críticos (Semana 1)

1) Cerrar reglas abiertas de datos/archivos





Problema: acceso global allow read, write: if true.



Acciones:





Definir política por defecto autenticada y autorizaciones por rol/empresa.



Endurecer reglas para colecciones críticas (usuarios, empresas, matrices, normativas).



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/firestore.rules](D:/GMA Sistema/gma-sistema-app/firestore.rules)



[D:/GMA Sistema/gma-sistema-app/storage.rules](D:/GMA Sistema/gma-sistema-app/storage.rules)

2) Eliminar contraseñas reversibles y “suplantación” desde frontend





Problema: cifrado reversible y clave expuesta en cliente.



Acciones:





Quitar almacenamiento/lectura de contraseñas en Firestore.



Migrar flujo a autenticación estricta con Firebase Auth y operaciones sensibles vía Functions seguras.



Retirar secrectKey del cliente.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/core/services/encriptador.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/encriptador.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/usuario.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/usuario.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/empresa/gestionar-usuarios/gestionar-usuarios.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/empresa/gestionar-usuarios/gestionar-usuarios.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/empresas/usuarios-index/usuarios-index.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/empresas/usuarios-index/usuarios-index.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/environments/environment.ts](D:/GMA Sistema/gma-sistema-app/src/environments/environment.ts)



[D:/GMA Sistema/gma-sistema-app/src/environments/environment.prod.ts](D:/GMA Sistema/gma-sistema-app/src/environments/environment.prod.ts)

3) Estabilizar contratos de usuario y errores críticos





Problema: acceso a docs[0] sin validación y errores silenciosos.



Acciones:





Validar casos vacíos/duplicados en consultas de usuario.



Estandarizar errores de dominio y propagación de errores en Functions.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/core/services/usuario.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/usuario.service.ts)



[D:/GMA Sistema/gma-sistema-app/functions/src/index.ts](D:/GMA Sistema/gma-sistema-app/functions/src/index.ts)

Fase 2: Rendimiento y deuda estructural alta (Semanas 2-3)

4) Corregir lazy loading real del frontend





Problema: módulos lazy también cargados en AppModule.



Acciones:





Mantener carga por rutas y remover imports eager redundantes.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/app.module.ts](D:/GMA Sistema/gma-sistema-app/src/app/app.module.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/app-routing.module.ts](D:/GMA Sistema/gma-sistema-app/src/app/app-routing.module.ts)

5) Reducir lecturas Firestore y recomputaciones en UI





Problema: cargas completas, filtros en cliente, métodos pesados en template.



Acciones:





Introducir queries paginadas/filtradas (where, limit, orderBy).



Precalcular mapas de datos para vistas (id->nombre, id->count).



Evitar funciones en templates de listas.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/core/services/matrices.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/matrices.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/normativa.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/normativa.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/empresas.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/empresas.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/matrices/index/index.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/matrices/index/index.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/matrices/view/view.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/matrices/view/view.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/normativas/index/index.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/normativas/index/index.component.ts)

6) Higiene reactiva: lifecycle de suscripciones





Problema: subscribe sin cierre consistente.



Acciones:





Estandarizar takeUntil/OnDestroy o async pipe.



Eliminar suscripciones anidadas con switchMap/combineLatest.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/share/header/header.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/share/header/header.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/inicio/index/index.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/inicio/index/index.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/usuario/perfil/perfil.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/usuario/perfil/perfil.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/share/multi-select/multi-select.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/share/multi-select/multi-select.component.ts)

7) Activar OnPush por etapas en listados críticos





Problema: detección por defecto en toda la app.



Acciones:





Iniciar por módulos de mayor volumen (matrices, normativas, empresas).



Ajustar actualización inmutable de colecciones.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/matrices](D:/GMA Sistema/gma-sistema-app/src/app/matrices)



[D:/GMA Sistema/gma-sistema-app/src/app/normativas](D:/GMA Sistema/gma-sistema-app/src/app/normativas)



[D:/GMA Sistema/gma-sistema-app/src/app/empresas](D:/GMA Sistema/gma-sistema-app/src/app/empresas)

Fase 3: Mantenibilidad y arquitectura evolutiva (Semanas 4-6)

8) Unificar dominios duplicados empresa/empresas





Problema: flujos de usuarios repetidos.



Acciones:





Consolidar componentes/servicios compartidos de gestión de usuarios.



Mantener solo diferencias de routing/contexto.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/empresa](D:/GMA Sistema/gma-sistema-app/src/app/empresa)



[D:/GMA Sistema/gma-sistema-app/src/app/empresas](D:/GMA Sistema/gma-sistema-app/src/app/empresas)

9) Tipado de dominio y reducción de any





Problema: pérdida de garantías de strict.



Acciones:





Crear interfaces de dominio (Usuario, Empresa, Matriz, Normativa, TipoNormativa).



Tipar contratos de servicios y formularios.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/core/services](D:/GMA Sistema/gma-sistema-app/src/app/core/services)



[D:/GMA Sistema/gma-sistema-app/src/app/matrices/view/view.component.ts](D:/GMA Sistema/gma-sistema-app/src/app/matrices/view/view.component.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/tipos-normativas.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/tipos-normativas.service.ts)

10) Crear capa de acceso a datos reusable





Problema: CRUD y carga de archivos duplicados en servicios.



Acciones:





Extraer base de repositorio Firestore para operaciones repetidas.



Centralizar subida de archivos para evitar duplicación en servicios.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/src/app/core/services/area-legal.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/area-legal.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/tipos-normativas.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/tipos-normativas.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/normativa.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/normativa.service.ts)



[D:/GMA Sistema/gma-sistema-app/src/app/core/services/empresas.service.ts](D:/GMA Sistema/gma-sistema-app/src/app/core/services/empresas.service.ts)

11) Evolucionar backend para operaciones sensibles





Problema: lógica sensible concentrada en cliente.



Acciones:





Mover operaciones críticas a Functions HTTP/callable con auditoría.



Mantener triggers solo para automatizaciones de datos.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/functions/src/index.ts](D:/GMA Sistema/gma-sistema-app/functions/src/index.ts)

12) Ajustar presupuesto de bundle y scripts legacy





Problema: scripts globales y budgets permisivos.



Acciones:





Revisar dependencia real de jquery/scripts globales.



Endurecer budgets para detectar regresiones de tamaño.



Archivos clave:





[D:/GMA Sistema/gma-sistema-app/angular.json](D:/GMA Sistema/gma-sistema-app/angular.json)



[D:/GMA Sistema/gma-sistema-app/package.json](D:/GMA Sistema/gma-sistema-app/package.json)

Backlog sugerido (orden recomendado)





Seguridad reglas Firebase.



Eliminación de credenciales reversibles y flujo de suplantación.



Validación robusta de contratos usuario + errores de dominio.



Lazy loading real en AppModule.



Optimización de consultas Firestore y templates.



Limpieza de suscripciones y operadores RxJS.



Consolidación módulos duplicados.



Tipado de dominio.



Capa de acceso a datos compartida.



Endurecimiento de bundle/config y evolución backend.

Criterio de cierre de cada iniciativa





Cambio desplegable sin romper navegación/operación principal.



Reducción observable del riesgo/costo técnico en el módulo intervenido.



Documentación mínima de decisiones técnicas y alcance aplicado.

Nota de alcance

Este plan excluye actividades de testing por solicitud explícita; se deja como fase futura de aseguramiento de calidad.