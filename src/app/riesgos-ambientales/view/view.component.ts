import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { debounceTime, Subject } from 'rxjs';
import { RANGO_RIESGOS } from 'src/app/core/services/constantes';
import { RiesgosService } from 'src/app/core/services/riesgos.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-view',
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

  usuario: any = {};
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

  cargando = true;
  guardando = false;

  constructor(
    private titleService: Title,
    private riesgosService: RiesgosService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Riesgos Ambientales");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.empresa.id = usuario?.['empresaId'];

      this.cargarDatos();
    });

    this.cambios$
      .pipe(debounceTime(2300))
      .subscribe(() => {
        this.guardarAuto();
      });
  }

  cargarDatos = async () => {
    const reRiesgo = await this.riesgosService.obtenerRiesgoPorEmpresaId(this.empresa.id);

    if (reRiesgo.docs.length === 0) {
      // crear riesgo si no existe
      const nuevoRiesgo = {
        empresaId: this.empresa.id,
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

  // basada en el riesgo
  calcularClasificacion(riesgo: number) {
    if (riesgo <= this.rangos[0].max) {
      return this.rangos[0];
    }

    if (riesgo <= this.rangos[1].max) {
      return this.rangos[1];
    }

    return this.rangos[2];
  }
}
