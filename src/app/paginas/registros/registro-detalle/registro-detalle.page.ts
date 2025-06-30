import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { RegistroService } from '../../../services/registro.service';
import { Registro } from '../../../models/registro.model';

@Component({
  selector: 'app-registro-detalle',
  templateUrl: './registro-detalle.page.html',
  styleUrls: ['./registro-detalle.page.scss'],
  standalone: false
})
export class RegistroDetallePage implements OnInit {

  /** observable con el registro que llega del backend */
  readonly reg$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),          // id de la URL
    switchMap(id => this.registroSrv.obtener(id))
  );

  reg!: Registro;

  constructor(
    private route: ActivatedRoute,
    private registroSrv: RegistroService
  ) { }

  ngOnInit() {
    //const idParam = this.route.snapshot.paramMap.get('id')!;
    //this.registroSrv.obtener(+idParam).subscribe(reg => (this.reg = reg));  // ← aquí
  }

}
