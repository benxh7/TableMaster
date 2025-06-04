import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  ocupantes: number;
  estado: 'libre' | 'reservada' | 'ocupada';
}

@Injectable({ providedIn: 'root' })
export class MesaService {
  private mesas$ = new BehaviorSubject<Mesa[]>(this.iniciales(6));

  getMesas() { return this.mesas$.asObservable(); }
  getMesa(id: string) { return this.mesas$.value.find(m => m.id === id)!; }
  reservar(id: string) { this.update(id, { estado: 'reservada' }); }
  ocupar(id: string, personas: number) {
    this.update(id, { estado: 'ocupada', ocupantes: personas });
  }
  liberar(id: string) { this.update(id, { estado: 'libre', ocupantes: 0 }); }

  private update(id: string, cambios: Partial<Mesa>) {
    this.mesas$.next(this.mesas$.value.map(m =>
      m.id === id ? { ...m, ...cambios } : m
    ));
  }
  private iniciales(n: number): Mesa[] {
    return Array.from({ length: n }, (_, i) => ({
      id: crypto.randomUUID(),
      numero: i + 1,
      capacidad: 6,
      ocupantes: 0,
      estado: 'libre' as const,
    }));
  }
}