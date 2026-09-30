import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-logo-empresa',
  templateUrl: './logo-empresa.component.html',
  styleUrls: ['./logo-empresa.component.scss']
})
export class LogoEmpresaComponent implements OnInit {
  @Output() logoListo = new EventEmitter<void>();

  urlLogo: string | null = null;

  ngOnInit(): void {
    this.urlLogo = localStorage.getItem('logo_empresa');

    if (!this.urlLogo) {
      this.logoListo.emit();
      return;
    }

    const img = new Image();
    img.onload = () => this.logoListo.emit();
    img.onerror = () => this.logoListo.emit();
    img.src = this.urlLogo;
  }
}
