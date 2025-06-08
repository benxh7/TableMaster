import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PedidoItem } from './mesa.service';

export interface Registro {
  id: string;
  numeroMesa: number;
  garzon?: string;
  fecha: Date;
  personas: number;
  items: PedidoItem[];
  total: number;
  propina: number;
  totalFinal: number;
}

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private registros$ = new BehaviorSubject<Registro[]>([]);
  list$ = this.registros$.asObservable();

  /**
   * Aqui vamos a añadir registros de ejemplo
   * ya que en esta actividad aun no aprendemos
   * conectar la aplicacion con una base de datos
   * para el correcto almacenamiento de los registros.
   * @param reg 
   */
  add(reg: Registro) {
    this.registros$.next([reg, ...this.registros$.value]);
  }

  getById(id: string) { return this.registros$.value.find(r => r.id === id); }
}