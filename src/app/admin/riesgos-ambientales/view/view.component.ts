import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { RANGO_RIESGOS } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { RiesgosService } from 'src/app/core/services/riesgos.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  private cambios$ = new Subject<void>();
  ths = [
    "#",
    "Actividad",
    "Aspecto Ambiental",
    "Impacto",
    "Probabilidad",
    "Severidad",
    "Riesgo",
    "Clasificación",
    "Control",
    "Acción"
  ];

  empresa = {
    id: "",
    nombre: ""
  };
  rangos = RANGO_RIESGOS;
  filaSeleccionada = -1;

  riesgos: any = {
    empresaId: '',
    riesgo: []
  };

  nombreArchivo = "";

  cargando = true;
  guardando = false;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private riesgosService: RiesgosService,
    private empresasService: EmpresasService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Riesgos Ambientales");

    this.route.params.subscribe(params => {
      const empresaId = params['id'];
      this.cargarDatos(empresaId);
    });

    this.cambios$
      .pipe(debounceTime(2300))
      .subscribe(() => {
        this.guardarAuto();
      });
  }

  cargarDatos = async (empresaId: string) => {
    this.empresa.id = empresaId;

    const reEmpresa = await this.empresasService.obtenerEmpresa(empresaId);
    const nombreEmpresa = (reEmpresa.get("nombre") as string).toLocaleLowerCase().replace(" ", "_");
    const numero = Date.now();

    this.nombreArchivo = nombreEmpresa + "_matriz_riesgos_" + numero;
    this.empresa.nombre = reEmpresa.get("nombre") as string;

    const reRiesgo = await this.riesgosService.obtenerRiesgoPorEmpresaId(empresaId);

    if (reRiesgo.docs.length === 0) {
      const nuevoRiesgo = {
        empresaId: empresaId,
        riesgo: [{...this.riesgosService.filaRiesgo()}]
      };

      const resNuevoRiesgo = await this.riesgosService.crearRiesgo(nuevoRiesgo);
      this.riesgos = { id: resNuevoRiesgo.id, ...nuevoRiesgo }
      this.cargando = false;

    } else {
      this.riesgos = { ...reRiesgo.docs[0].data(), id: reRiesgo.docs[0].id };
      this.cargando = false;
    }
  };

  guardarAuto() {
    if (!this.empresa.id) return;

    this.riesgosService.editarRiesgo(this.riesgos).then(_ => {
      this.guardando = false;
    });
  }

  detectarCambiosInput() {
    this.cambios$.next();
    this.guardando = true;
  }

  agregarFila() {
    this.riesgos.riesgo.push(this.riesgosService.filaRiesgo());
    this.cambios$.next();
    this.guardando = true;
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      if (confirm("¿Desea borrar la fila?")) {
        this.riesgos.riesgo.splice(this.filaSeleccionada, 1);
        this.filaSeleccionada = -1;
        this.cambios$.next();
        this.guardando = true;
      }
    }
  }

  duplicarFila() {
    if (this.filaSeleccionada !== -1) {
      const seleccion = {...this.riesgos.riesgo[this.filaSeleccionada]};
      this.riesgos.riesgo = [...this.riesgos.riesgo, seleccion];
      this.filaSeleccionada = -1;
      this.cambios$.next();
      this.guardando = true;
    }
  }

  seleccionarFila(event: Event, index: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.filaSeleccionada = index;
    } else {
      this.filaSeleccionada = -1
    }
  }

  calcularClasificacion(riesgo: number) {
    if (riesgo <= this.rangos[0].max) {
      return this.rangos[0];
    }

    if (riesgo <= this.rangos[1].max) {
      return this.rangos[1];
    }

    return this.rangos[2];
  }

  descargarMatriz() {
    const encabezados = Object.values(this.ths);
    encabezados.shift();

    const filas = this.riesgos.riesgo.map((r: any) => [
      r.actividad,
      r.aspectoAmbiental,
      r.impacto,
      r.p,
      r.s,
      r.p * r.s,
      this.calcularClasificacion(r.p * r.s).label,
      r.control,
      r.accion
    ]);

    const contenido = [
      encabezados.join(';'),
      ...filas.map((fila: any) => fila.join(';'))
    ].join('\n');

    const blob = new Blob(
      ['\uFEFF' + contenido],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.nombreArchivo}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
