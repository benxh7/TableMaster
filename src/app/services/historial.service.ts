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

  add(reg: Registro) {
    this.registros$.next([reg, ...this.registros$.value]);
  }

  getById(id: string) { return this.registros$.value.find(r => r.id === id); }
}