import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { Observable } from 'rxjs';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.page.html',
  styleUrls: ['./registros.page.scss'],
  standalone: false
})
export class RegistrosPage implements OnInit {

  registros$: Observable<Registro[]> = this.regSrv.listar();

  constructor(private regSrv: RegistroService) { }

  ngOnInit() {
  }

}
