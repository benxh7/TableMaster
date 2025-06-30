import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, merge, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from './producto.service';
import { Registro } from '../models/registro.model';

export interface PedidoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: Producto;
}

/**
 * Nuestra interfaz Mesa representa una mesa en el restaurante
 * lo que nos permite gestionar su estado la capacidad y los pedidos
 * asociados a esta de manera que podamos llevar un control
 * de las mesas que estan libres, ocupadas o reservadas.
 * 
 * Esto tambien le da una ayuda al garzon para que pueda verificar
 * el consumo que tienen los clientes de la mesa.
 */
export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ocupantes: number;
  estado: 'libre' | 'reservada' | 'ocupada';
  garzon?: string;
  items: PedidoItem[];
}

@Injectable({ providedIn: 'root' })
export class MesaService {

  private apiUrl = `${environment.apiUrl}/mesas`;
  private reload$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) { }

  /**
   * Devuelve un observable de la lista de mesas,
   * recargado automáticamente al invocar acciones.
   */
  obtenerMesas(): Observable<Mesa[]> {
    return merge(
      this.http.get<Mesa[]>(this.apiUrl),
      this.reload$.pipe(switchMap(() => this.http.get<Mesa[]>(this.apiUrl)))
    );
  }

  /** 
   * Obtenemos una mesa individual con sus items
   */
  obtenerMesa(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva mesa con la capacidad indicada (por defecto 6).
   */
  añadirMesa(capacidad = 6): void {
    this.http.post<Mesa>(this.apiUrl, { capacidad })
      .subscribe(() => this.recargar());
  }

  /** 
   * Agregamos un producto a la mesa mediante FastAPI
   */
  añadirProducto(mesaId: number, productoId: number, cantidad = 1): void {
    this.http.post<Mesa>(`${this.apiUrl}/${mesaId}/items`,{ producto_id: productoId, cantidad }).subscribe(() => this.recargar());
  }

  /**
   * Reservamos la mesa estableciendo su estado a "reservada".
   */
  reservar(id: number): void {
    this.http.put<Mesa>(`${this.apiUrl}/${id}/reservar`, {})
      .subscribe(() => this.recargar());
  }
  
  /**
   * Ocupamos la mesa con el numero de ocupantes y opcionalmente un garzon.
   */
  ocupar(id: number, ocupantes: number, garzon?: string): void {
    this.http.put<Mesa>(
      `${this.apiUrl}/${id}/ocupar`,
      { ocupantes, garzon }
    ).subscribe(() => this.recargar());
  }

  /**
   * Liberamos la mesa devolviendola al estado "libre".
   */
  liberar(id: number): void {
    this.http.put<Mesa>(`${this.apiUrl}/${id}/liberar`, {})
      .subscribe(() => this.recargar());
  }

  /** 
   * Cobramos la mesa y registramos el pago en un unico metodo POST
   */
  cobrarMesa(mesaId: number, propina: number, usuarioId: number) {
    return this.http.post<Registro>(
      `${this.apiUrl}/${mesaId}/cobrar`,
      { propina, usuario_id: usuarioId }
    );
  }

  /**
   * Recargamos los datos para actualizar la lista de mesas.
   */
  recargar(): void {
    this.reload$.next();
  }
}