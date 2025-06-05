import { Component, OnInit } from '@angular/core';
import { HistorialService, Registro } from '../services/historial.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.page.html',
  styleUrls: ['./registros.page.scss'],
  standalone: false
})
export class RegistrosPage implements OnInit {

  registros$: Observable<Registro[]> = this.histSrv.list$;

  constructor(private histSrv: HistorialService) { }

  ngOnInit() {
  }

}
