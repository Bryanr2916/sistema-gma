# GmaSistemaApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Entorno de datos (producción vs. pruebas)

Los datos viven en el mismo proyecto Firebase y se separan por el sufijo `-dev` en las colecciones
de Firestore y las carpetas de Storage (`usuarios` / `usuarios-dev`, `empresas/logos` / `empresas/logos-dev`, ...).

- **Local (`ng serve`)**: usa datos de pruebas por defecto (`environment.useProductionData: false`).
  Para ver datos de producción en local, cambia a `true` en `src/environments/environment.ts`.
- **Producción (`ng build`)**: usa datos de producción (`environment.prod.ts`).

Para **ver los datos de pruebas desde producción** (build ya desplegado), abre la consola del navegador y ejecuta:

```js
localStorage.setItem('GMA_ENTORNO', 'gma-entorno-pruebas-2026'); // valor de environment.claveEntornoPruebas
location.reload();
```

Aparecerá un aviso amarillo **"ENTORNO DE PRUEBAS"** en la barra superior. Para volver a producción:

```js
localStorage.removeItem('GMA_ENTORNO');
location.reload();
```

La lógica vive en `src/app/core/entorno-datos.ts`; los servicios usan `rutaDatos(...)` para resolver sus rutas.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
