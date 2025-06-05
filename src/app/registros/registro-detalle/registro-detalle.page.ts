import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistorialService, Registro } from '../../services/historial.service';

@Component({
  selector: 'app-registro-detalle',
  templateUrl: './registro-detalle.page.html',
  styleUrls: ['./registro-detalle.page.scss'],
  standalone: false
})
export class RegistroDetallePage implements OnInit {

  reg!: Registro;

  constructor(
    private route: ActivatedRoute,
    private histSrv: HistorialService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.reg = this.histSrv.getById(id)!;
  }

}
