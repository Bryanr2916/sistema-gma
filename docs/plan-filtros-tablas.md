# Plan: Filtros para las tablas (componentes index)

> **Fecha:** 2026-11-04
> **Estado:** Plan aprobado — pendiente de implementación
> **Objetivo:** Incorporar filtros (dropdowns con buscador) a los listados del sistema, integrados con la búsqueda y paginación existentes, sin afectar el acceso al botón "Crear".

---

## 1. Contexto técnico

- **Angular 13 + Bootstrap 5**, datos directos desde **Firestore** (sin API intermedia), **sin uso de query params** en toda la app.
- **Búsqueda**: siempre *client-side* sobre datos ya descargados (en 3 tablas con *debounce* 300 ms y caché del listado completo).
- **Paginación real (server-side por cursor de Firestore, 20/página)** solo en 3 tablas: **Empresas**, **Normativas** y **Riesgos ambientales (admin)**. En modo búsqueda, esas tablas ya cambian a paginación `slice()` en cliente.
- **Dropdown custom existente**: `<app-dropdown-search>` (`src/app/share/dropdown-search/`) — combobox con buscador interno multi-campo (`searchFields`), single-select. Hoy está atado a un `FormGroup` (`[formulario]` + `[controlName]`), por lo que necesita una adaptación menor para usarse como filtro (ver Fase 0).
- **No existe ninguna infraestructura de filtros**: cero selects/filtros en los listados actuales.

---

## 2. Ubicación de los filtros (no afecta el botón "Crear")

**Decisión: segunda fila de toolbar, debajo de la fila actual.**

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 [Buscar................]                    [ + Crear X ]│  ← fila 1 (sin cambios, Crear a la derecha)
├──────────────────────────────────────────────────────────────┤
│  [Tipo ▾] [Estado ▾] [Empresa ▾]        ✕ Limpiar filtros   │  ← fila 2 (solo se renderiza si la tabla tiene filtros)
└──────────────────────────────────────────────────────────────┘
        📄 tabla (sin cambios)                    ⬅ paginación
```

- El botón **Crear mantiene su posición exacta** (derecha, fila 1) y nunca queda tapado ni desplazado.
- Los dropdowns quedan alineados a la izquierda, con ancho fijo (~200px), y el botón **"Limpiar filtros"** se muestra solo cuando hay algún filtro activo.
- **Alternativa descartada**: meter los filtros en la misma fila `nav-pills` entre búsqueda y Crear → se aplasta en pantallas medianas/móviles y compite visualmente con Crear.
- **Opcional (pulido futuro)**: *badges* de filtros activos con contador, ej. `Estado: Vencido ×`.

---

## 3. Comportamiento e integración con búsqueda y paginación

**Lógica única combinada (AND):** cada componente index tendrá un solo pipeline `aplicarListado()`:

```
filtrados = datos.filter(pasaBusqueda AND pasaFiltroTipo AND pasaFiltroEstado …)
```

| Escenario | Cómo se resuelve |
|---|---|
| **Tablas sin paginación** | Filtrado en memoria sobre el array completo (mismo patrón que la búsqueda actual). |
| **Tablas con paginación server-side** (Empresas, Normativas, Riesgos admin) | **Fase 1**: reutilizar el "modo búsqueda" existente — al activar un filtro se usa el listado completo ya cacheado y se pagina con `slice()` en cliente. Cero cambios en Firestore, cero índices compuestos. **Fase 2 (futuro)**: componer `where()` + `orderBy()` en los servicios (`empresas.service.ts`, `normativa.service.ts`) con `getCountFromServer` ajustado; requiere índices compuestos en `firestore.indexes.json`. |
| **Cambio de filtro** | Resetea a página 1 y limpia `filaSeleccionada` (la barra de acciones Borrar/Editar no debe apuntar a una fila que ya no está). |
| **Mensajes** | Mantener la distinción actual: "No se encontraron resultados" (hubo datos pero no coinciden) vs "No hay X registrados". |
| **Opciones de los dropdowns** | Estáticas desde `core/services/constantes.ts` (`TIPOS_PERMISO`, `ESTADOS_PERMISO`, `TIPOS_USUARIO`) → costo cero. Dinámicas desde datos ya cargados (tipos de normativa, empresas, usuarios). |

---

## 4. Adaptación del dropdown custom (Fase 0)

Extender `DropdownSearchComponent` con un **modo "filtro controlado" opcional**, sin romper los usos actuales en formularios:

- Nuevos `@Input() valor` + `@Output() valorChange` (o `filtroChange`).
- Si no se pasa `[formulario]`, el componente emite en vez de escribir en un `FormGroup` (hoy `formulario` es obligatorio implícito → hacerlo opcional).
- `labelSeleccionVacia = 'Todos'` para el estado por defecto.
- Reutiliza tal cual: buscador interno, `searchFields`, cierre con click externo, pipe `truncarTexto`.

*Alternativa descartada:* crear un `app-dropdown-filtro` duplicado → mantendría dos versiones del mismo componente.

---

## 5. INFORME: Tablas y filtros propuestos

| # | Tabla (ruta) | Archivo | Paginación | Filtros propuestos | Prioridad |
|---|---|---|---|---|---|
| 1 | **Permisos – empresa** (`/permisos`) | `src/app/permisos/index/` | No | **Tipo** (`TIPOS_PERMISO`), **Estado** (`ESTADOS_PERMISO`: vigente/vence pronto/vencido), **Vencimiento** (próximos 30/60/90 días) — datos ya cargados en el componente | 🔴 Alta |
| 2 | **Permisos – admin** (`/admin/permisos`) | `src/app/admin/permisos/index/` | No | Tipo, Estado, Vencimiento + **Empresa** | 🔴 Alta |
| 3 | **Usuarios de empresa** (`/empresas/:id/usuarios`) | `src/app/empresas/usuarios-index/` | No | **Tipo** (Administrador/Editor/Lector) | 🔴 Alta |
| 4 | **Gestionar usuarios** (`/empresa/gestionar-usuarios`) | `src/app/empresa/gestionar-usuarios/` | No | **Tipo** | 🔴 Alta |
| 5 | **Normativas** (`/normativas`) | `src/app/normativas/index/` | ✅ Server (cursor 20) | **Tipo de normativa** + **Archivo: Con archivo / Sin archivo** (según `urlArchivo`) | 🟡 Media |
| 6 | **Matrices – admin** (`/admin/matrices`) | `src/app/admin/matrices/index/` | No | **Empresa**, **Con/Sin artículos aplicables** | 🟡 Media |
| 7 | **Matrices – empresa** (`/matrices`) | `src/app/matrices/index/` | No | **Con/Sin artículos aplicables** | 🟡 Media |
| 8 | **Empresas** (`/empresas`) | `src/app/empresas/index/` | ✅ Server (cursor 20) | Únicamente **Administrador: Con admin / Sin admin** (derivado de la colección `usuarios`) | 🟡 Media |
| 9 | **Riesgos ambientales – admin** (`/admin/riesgos-ambientales`) | `src/app/admin/riesgos-ambientales/index/` | ✅ Server (cursor 20) | ⚠️ **Sin filtros por ahora** — solo 1 columna (Empresa) | 🟢 Baja |
| 10 | **Tipos de normativas** (`/tipos-normativas`) | `src/app/tipos-normativas/index/` | No | ❌ **Sin filtros** — 1 columna, la búsqueda cubre la necesidad | ⚪ N/A |
| 11 | **Área legal** (`/area-legal`) | `src/app/area-legal/index/` | No | ❌ **Sin filtros** — 1 columna | ⚪ N/A |
| 12 | **Buscar** (`/buscar`) | `src/app/buscar/index/` | — | ❌ Página stub sin tabla (fuera de alcance) | ⚪ N/A |

### 5.1 Notas técnicas de filtros clave

**Normativas – Archivo (Con/Sin archivo)**
- Opción estática de 2 elementos: `[{valor: 'con', etiqueta: 'Con archivo'}, {valor: 'sin', etiqueta: 'Sin archivo'}]`.
- Filtrado: `con → !!normativa.urlArchivo`, `sin → !normativa.urlArchivo`.
- Normativas es **paginada server-side** → en Fase 1 se aplica sobre el listado cacheado (mismo mecanismo que la búsqueda actual). `urlArchivo` es un campo del documento, por lo que en el futuro podría filtrarse server-side con `where('urlArchivo','!=',null)`.

**Empresas – Administrador (Con admin/Sin admin)**
- Opción estática de 2 elementos.
- Derivado en cliente: `usuarios.find(u => u.empresaId === empresa.id && u.tipo === TIPOS_USUARIO.admin)` — la lista de usuarios ya está en memoria del componente (no hay carga extra).
- No existe campo `tieneAdmin` en Firestore → obligatoriamente en cliente. Para server-side en el futuro habría que crear un campo denormalizado.
- Empresas es **paginada server-side** → en Fase 1 se aplica sobre el listado cacheado.

---

## 6. Fases de implementación

1. **Fase 0 – Base**: adaptar `<app-dropdown-search>` a modo filtro (`valor`/`valorChange`, `formulario` opcional) + helper de filtrado compartido en `src/app/core/utils/`.
2. **Fase 1 – Piloto de alto valor**: Permisos (empresa) y Usuarios de empresa — tablas simples sin paginación, filtros con datos ya cargados.
3. **Fase 2 – Resto sin paginación**: gestionar-usuarios, permisos admin, matrices ×2.
4. **Fase 3 – Tablas paginadas**: Empresas, Normativas, Riesgos admin usando el "modo búsqueda/client-slice" existente.
5. **Fase 4 – Futuro (opcional)**: filtros server-side con `where()` + índices compuestos Firestore; persistencia de filtros en query params (hoy no se usa en la app).

---

## 7. Criterios de aceptación globales

- Botón "Crear" siempre visible en la fila superior, sin desplazarse.
- Filtros combinados entre sí y con la búsqueda en modo **AND**.
- Cambiar filtro → página 1 + limpiar selección de fila.
- Dropdowns con buscador interno (útil con listas largas, ej. empresas).
- "Limpiar filtros" restablece todos los filtros.
- Diseño responsive: los filtros hacen *wrap* en móvil sin tapar la tabla.
- Los mensajes de "sin resultados" / "sin registros" siguen distinguiéndose correctamente.
