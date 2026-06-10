export const TIPOS_USUARIO = {
    "adminSistema": 1,
    "admin": 2,
    "editor": 3,
    "lector": 4
}

export const ESTADOS_ARTICULO = [
    { key: "no-cumple", value: 1, label: "No Cumple", clase: "danger" },
    { key: "vencido", value: 2, label: "Vencido", clase: "warning" },
    { key: "en-tramite", value: 3, label: "En Trámite", clase: "light" },
    { key: "cumple", value: 4, label: "Cumple", clase: "success" },
    { key: "no-aplica", value: 5, label: "No Aplica", clase: "secondary" },
    { key: "de-conocimiento", value: 6, label: "De Conocimiento", clase: "info" }
];

export const RANGO_RIESGOS = [
    { key: "bajo", max: 4, label: "Bajo", clase: "success"},
    { key: "medio", max: 9, label: "Medio", clase: "warning" },
    { key: "alto", max: Infinity, label: "Alto", clase: "danger" }
];

export const ESTADOS_PERMISO = [
    { key: "vigente", label: "Vigente", clase: "success" },
    { key: "proximo", label: "Próximo a vencer", clase: "warning" },
    { key: "vencido", label: "Vencido", clase: "danger" },
    { key: "renovacion", label: "Renovación en proceso", clase: "info" },
    { key: "suspendido", label: "Suspendido", clase: "secondary" },
];

export const TIPOS_PERMISO = [
    { key: "permiso", label: "Permiso" },
    { key: "licencia", label: "Licencia" },
    { key: "contrato", label: "Contrato" },
    { key: "poliza", label: "Póliza" },
    { key: "certificacion", label: "Certificación" },
    { key: "inspeccion", label: "Inspección" },
    { key: "tramite", label: "Trámite" },
    { key: "otro", label: "Otro" },
];
